package vn.edu.iuh.sv.vcarbe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaginationMetadata {
    private int page;
    private int pageSize;
    private long itemCount;
    private int pageCount;
    private boolean hasPreviousPage;
    private boolean hasNextPage;

    public PaginationMetadata(Page<?> page) {
        this.page = page.getNumber();
        this.pageSize = page.getSize();
        this.itemCount = page.getTotalElements();
        this.pageCount = page.getTotalPages();
        this.hasPreviousPage = page.hasPrevious();
        this.hasNextPage = page.hasNext();
    }
}