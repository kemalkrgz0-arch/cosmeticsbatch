type PhotoAssistCopy = {
  edit: string;
  rotate: string;
  crop: string;
  contrast: string;
  remove: string;
};

const copy: Record<string, PhotoAssistCopy> = {
  en: { edit: "Adjust photo", rotate: "Rotate", crop: "Center crop", contrast: "Increase contrast", remove: "Remove" },
  de: { edit: "Foto anpassen", rotate: "Drehen", crop: "Mittig zuschneiden", contrast: "Kontrast erhöhen", remove: "Entfernen" },
  es: { edit: "Ajustar foto", rotate: "Girar", crop: "Recorte centrado", contrast: "Aumentar contraste", remove: "Eliminar" },
  it: { edit: "Regola foto", rotate: "Ruota", crop: "Ritaglio centrale", contrast: "Aumenta contrasto", remove: "Rimuovi" },
  ja: { edit: "写真を調整", rotate: "回転", crop: "中央で切り抜く", contrast: "コントラストを上げる", remove: "削除" },
  fr: { edit: "Ajuster la photo", rotate: "Pivoter", crop: "Recadrer au centre", contrast: "Augmenter le contraste", remove: "Supprimer" },
  nl: { edit: "Foto aanpassen", rotate: "Draaien", crop: "Gecentreerd bijsnijden", contrast: "Contrast verhogen", remove: "Verwijderen" },
  sv: { edit: "Justera foto", rotate: "Rotera", crop: "Centrerad beskärning", contrast: "Öka kontrasten", remove: "Ta bort" },
  da: { edit: "Juster foto", rotate: "Roter", crop: "Centreret beskæring", contrast: "Øg kontrast", remove: "Fjern" },
  ko: { edit: "사진 조정", rotate: "회전", crop: "가운데 자르기", contrast: "대비 높이기", remove: "삭제" },
  ar: { edit: "ضبط الصورة", rotate: "تدوير", crop: "اقتصاص من الوسط", contrast: "زيادة التباين", remove: "إزالة" },
  pt: { edit: "Ajustar foto", rotate: "Rodar", crop: "Recorte central", contrast: "Aumentar contraste", remove: "Remover" },
  tr: { edit: "Fotoğrafı düzenle", rotate: "Döndür", crop: "Ortadan kırp", contrast: "Kontrastı artır", remove: "Kaldır" },
  vi: { edit: "Điều chỉnh ảnh", rotate: "Xoay", crop: "Cắt giữa", contrast: "Tăng độ tương phản", remove: "Xóa" },
  id: { edit: "Sesuaikan foto", rotate: "Putar", crop: "Pangkas tengah", contrast: "Tingkatkan kontras", remove: "Hapus" },
  pl: { edit: "Dostosuj zdjęcie", rotate: "Obróć", crop: "Przytnij centralnie", contrast: "Zwiększ kontrast", remove: "Usuń" },
  ru: { edit: "Настроить фото", rotate: "Повернуть", crop: "Обрезать по центру", contrast: "Увеличить контраст", remove: "Удалить" },
  zh: { edit: "调整照片", rotate: "旋转", crop: "居中裁剪", contrast: "增强对比度", remove: "删除" },
  yue: { edit: "調整相片", rotate: "旋轉", crop: "置中裁剪", contrast: "增加對比度", remove: "移除" },
};

export function photoAssistCopy(locale: string): PhotoAssistCopy {
  return copy[locale] ?? copy.en;
}
