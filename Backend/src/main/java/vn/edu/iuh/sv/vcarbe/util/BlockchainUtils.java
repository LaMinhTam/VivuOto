package vn.edu.iuh.sv.vcarbe.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tuples.generated.Tuple9;
import org.web3j.tx.Transfer;
import org.web3j.tx.gas.StaticGasProvider;
import org.web3j.utils.Convert;
import vn.edu.iuh.sv.vcarbe.entity.CarRental;
import vn.edu.iuh.sv.vcarbe.entity.RentalContract;
import vn.edu.iuh.sv.vcarbe.exception.AppException;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.request.Transaction;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.utils.Convert;
import vn.edu.iuh.sv.vcarbe.exception.AppException;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.List;

@Component
public class BlockchainUtils {
    @Value("${blockchain.contractAddress}")
    private String contractAddress;
    @Value("${blockchain.infuraUrl}")
    private String infuraUrl;
    @Value("${blockchain.privateKey}")
    private String privateKey;

    public String sendSepoliaETH(String toAddress, BigDecimal amountInEth) {
        try {
            Web3j web3j = Web3j.build(new HttpService(infuraUrl));
            TransactionManager transactionManager = new RawTransactionManager(
                    web3j,
                    Credentials.create(privateKey)
            );
            Transfer transfer = new Transfer(web3j, transactionManager);
            TransactionReceipt transactionReceipt = transfer.sendFunds(
                    toAddress,
                    amountInEth,
                    Convert.Unit.ETHER,
                    BigInteger.valueOf(20000000000L),
                    BigInteger.valueOf(21000L)
            ).send();
            return null;
        } catch (Exception e) {
            throw new AppException(500, "Failed to send SepoliaETH: " + e.getMessage());
        }
    }

    public CarRental loadCarRentalContract() {
        return CarRental.load(
                contractAddress,
                Web3j.build(new HttpService(infuraUrl)),
                Credentials.create(privateKey),
                new StaticGasProvider(BigInteger.valueOf(20000000000L), BigInteger.valueOf(6721975L))
        );
    }

    public TransactionReceipt createRentalContract(RentalContract rentalContract) {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<TransactionReceipt> transactionReceipt = carRentalContract.createContract(
                rentalContract.getId().toHexString(),
                rentalContract.getRentalRequestId().toHexString(),
                rentalContract.getCarId().toHexString(),
                rentalContract.getLessorId().toHexString(),
                rentalContract.getLesseeId().toHexString(),
                BigInteger.valueOf(rentalContract.getRentalStartDate().getTime()),
                BigInteger.valueOf(rentalContract.getRentalEndDate().getTime()),
                BigInteger.valueOf((long) rentalContract.getTotalRentalValue())
        );

        try {
            return executeTransaction(transactionReceipt);
        } catch (Exception e) {
            throw new AppException(500, e.getMessage());
        }
    }


    public void approveRentalContract(String contractId) {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<TransactionReceipt> transactionCall = carRentalContract.approveContract(contractId);
        executeTransaction(transactionCall);
    }


    public List getContractsByIds(List<String> contractIds) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<List> contractCall = carRentalContract.getContractsByIds(contractIds);
        return contractCall.send();
    }

    public Boolean isContractApproved(String contractId) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<Boolean> statusCall = carRentalContract.contractStatus(contractId);
        return statusCall.send();
    }

    public Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean> getRentalContractDetails(String contractId) throws Exception {
        CarRental carRentalContract = loadCarRentalContract();
        RemoteFunctionCall<Tuple9<String, String, String, String, String, BigInteger, BigInteger, BigInteger, Boolean>> contractCall = carRentalContract.rentalContracts(contractId);
        return contractCall.send();
    }

    public TransactionReceipt executeTransaction(RemoteFunctionCall<TransactionReceipt> transactionCall) {
        TransactionReceipt receipt = null;
        try {
            receipt = transactionCall.send();
        } catch (Exception e) {
            throw new AppException(500, e.getMessage());
        }
        if (!receipt.isStatusOK()) {
            throw new AppException(500, "Transaction failed with status " + receipt.getStatus());
        }
        return receipt;
    }
}
