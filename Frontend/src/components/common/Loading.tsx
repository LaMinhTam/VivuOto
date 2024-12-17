import { Spin } from "antd";

const Loading = () => {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
            <Spin spinning size="large"></Spin>
        </div>
    );
};

export default Loading;