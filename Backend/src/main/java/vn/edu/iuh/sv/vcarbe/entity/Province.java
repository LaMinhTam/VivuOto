package vn.edu.iuh.sv.vcarbe.entity;

public enum Province {
    Ha_Giang("Hà Giang"),
    Cao_Bang("Cao Bằng"),
    Lao_Cai("Lào Cai"),
    Son_La("Sơn La"),
    Lai_Chau("Lai Châu"),
    Bac_Kan("Bắc Kạn"),
    Lang_Son("Lạng Sơn"),
    Tuyen_Quang("Tuyên Quang"),
    Yen_Bai("Yên Bái"),
    Thai_Nguyen("Thái Nguyên"),
    Dien_Bien("Điện Biên"),
    Phu_Tho("Phú Thọ"),
    Vinh_Phuc("Vĩnh Phúc"),
    Bac_Giang("Bắc Giang"),
    Bac_Ninh("Bắc Ninh"),
    Ha_Noi("Hà Nội"),
    Quang_Ninh("Quảng Ninh"),
    Hai_Duong("Hải Dương"),
    Hai_Phong("Hải Phòng"),
    Hoa_Binh("Hòa Bình"),
    Hung_Yen("Hưng Yên"),
    Ha_Nam("Hà Nam"),
    Thai_Binh("Thái Bình"),
    Nam_Dinh("Nam Định"),
    Ninh_Binh("Ninh Bình"),
    Thanh_Hoa("Thanh Hóa"),
    Nghe_An("Nghệ An"),
    Ha_Tinh("Hà Tĩnh"),
    Quang_Binh("Quảng Bình"),
    Quang_Tri("Quảng Trị"),
    Thua_Thien_Hue("Thừa Thiên Huế"),
    Da_Nang("Đà Nẵng"),
    Quang_Nam("Quảng Nam"),
    Quang_Ngãi("Quảng Ngãi"),
    Kon_Tum("Kon Tum"),
    Gia_Lai("Gia Lai"),
    Binh_Dinh("Bình Định"),
    Phu_Yen("Phú Yên"),
    Dak_Lak("Đắk Lắk"),
    Khanh_Hoa("Khánh Hòa"),
    Dak_Nong("Đắk Nông"),
    Lam_Dong("Lâm Đồng"),
    Ninh_Thuan("Ninh Thuận"),
    Binh_Phuoc("Bình Phước"),
    Tay_Ninh("Tây Ninh"),
    Binh_Duong("Bình Dương"),
    Dong_Nai("Đồng Nai"),
    Binh_Thuan("Bình Thuận"),
    Ho_Chi_Minh("Hồ Chí Minh"),
    Long_An("Long An"),
    Vung_Tau("Vũng Tàu"),
    Dong_Thap("Đồng Tháp"),
    An_Giang("An Giang"),
    Tien_Giang("Tiền Giang"),
    Vinh_Long("Vĩnh Long"),
    Ben_Tre("Bến Tre"),
    Can_Tho("Cần Thơ"),
    Kien_Giang("Kiên Giang"),
    Tra_Vinh("Trà Vinh"),
    Hau_Giang("Hậu Giang"),
    Soc_Trang("Sóc Trăng"),
    Bac_Lieu("Bạc Liêu"),
    Ca_Mau("Cà Mau");

    private final String displayName;

    Province(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
