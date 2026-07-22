type ProductCandidateCopy = {
  possible: string;
  ambiguous: string;
};

const RAW: Record<string, ProductCandidateCopy> = {
  en: { possible: "Possible product: {product}", ambiguous: "This EAN matches more than one sourced package variant, so we cannot select the exact pack yet." },
  tr: { possible: "Olası ürün: {product}", ambiguous: "Bu EAN birden fazla kaynaklı ambalaj varyantıyla eşleşiyor; bu nedenle kesin ambalajı henüz seçemiyoruz." },
  de: { possible: "Mögliches Produkt: {product}", ambiguous: "Diese EAN stimmt mit mehreren belegten Verpackungsvarianten überein; die genaue Packung lässt sich noch nicht bestimmen." },
  es: { possible: "Producto posible: {product}", ambiguous: "Este EAN coincide con más de una variante de envase documentada, por lo que aún no podemos determinar el envase exacto." },
  it: { possible: "Possibile prodotto: {product}", ambiguous: "Questo EAN corrisponde a più varianti di confezione documentate; non possiamo ancora determinare la confezione esatta." },
  fr: { possible: "Produit possible : {product}", ambiguous: "Cet EAN correspond à plusieurs variantes d’emballage documentées ; nous ne pouvons donc pas encore déterminer l’emballage exact." },
  nl: { possible: "Mogelijk product: {product}", ambiguous: "Deze EAN komt overeen met meerdere gedocumenteerde verpakkingsvarianten; de exacte verpakking is nog niet vast te stellen." },
  sv: { possible: "Möjlig produkt: {product}", ambiguous: "Detta EAN matchar flera dokumenterade förpackningsvarianter, så den exakta förpackningen kan ännu inte fastställas." },
  da: { possible: "Muligt produkt: {product}", ambiguous: "Denne EAN matcher flere dokumenterede emballagevarianter, så den præcise pakning kan endnu ikke fastslås." },
  pt: { possible: "Produto possível: {product}", ambiguous: "Este EAN corresponde a mais de uma variante de embalagem documentada, por isso ainda não podemos determinar a embalagem exata." },
  pl: { possible: "Możliwy produkt: {product}", ambiguous: "Ten EAN pasuje do kilku udokumentowanych wariantów opakowania, dlatego nie można jeszcze wskazać dokładnego opakowania." },
  ru: { possible: "Возможный продукт: {product}", ambiguous: "Этот EAN соответствует нескольким подтверждённым вариантам упаковки, поэтому точную упаковку пока определить нельзя." },
  ar: { possible: "المنتج المحتمل: {product}", ambiguous: "يتطابق رمز EAN هذا مع أكثر من نوع موثق من العبوة، لذلك لا يمكننا تحديد العبوة الدقيقة بعد." },
  ja: { possible: "該当する可能性のある製品：{product}", ambiguous: "このEANは複数の根拠付きパッケージ仕様に一致するため、現時点では正確なパッケージを特定できません。" },
  ko: { possible: "가능성이 있는 제품: {product}", ambiguous: "이 EAN은 출처가 확인된 여러 포장 변형과 일치하므로 아직 정확한 포장을 특정할 수 없습니다." },
  vi: { possible: "Sản phẩm có thể là: {product}", ambiguous: "EAN này khớp với nhiều biến thể bao bì có nguồn, nên chưa thể xác định chính xác bao bì." },
  id: { possible: "Kemungkinan produk: {product}", ambiguous: "EAN ini cocok dengan lebih dari satu varian kemasan bersumber, sehingga kemasan pastinya belum dapat ditentukan." },
  zh: { possible: "可能的产品：{product}", ambiguous: "此 EAN 对应多个有来源依据的包装版本，因此暂时无法确定具体包装。" },
  yue: { possible: "可能嘅產品：{product}", ambiguous: "呢個 EAN 對應多個有來源依據嘅包裝版本，所以暫時未能確定實際包裝。" },
};

export function productCandidateCopy(locale: string) {
  return RAW[locale] ?? RAW.en;
}

export const PRODUCT_CANDIDATE_LOCALES = Object.freeze(Object.keys(RAW));
