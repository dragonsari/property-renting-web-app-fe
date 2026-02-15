import * as Yup from "yup";

export const CreatePropertySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Nama properti minimal 3 karakter")
    .required("Nama properti wajib diisi"),

  description: Yup.string()
    .trim()
    .min(10, "Deskripsi minimal 10 karakter")
    .required("Deskripsi wajib diisi"),

  categoryId: Yup.string()
    .required("Category wajib dipilih"),

  address: Yup.string()
    .trim()
    .min(5, "Alamat terlalu pendek")
    .matches(
      /indonesia$/i,
      "Alamat harus diakhiri dengan 'Indonesia'"
    )
    .required("Address wajib diisi"),
});
