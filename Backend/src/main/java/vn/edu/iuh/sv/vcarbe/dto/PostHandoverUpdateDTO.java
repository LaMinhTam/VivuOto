package vn.edu.iuh.sv.vcarbe.dto;

import org.bson.types.ObjectId;
import vn.edu.iuh.sv.vcarbe.entity.HandoverIssue;

public record PostHandoverUpdateDTO(
        HandoverIssue handoverIssue) {
}
