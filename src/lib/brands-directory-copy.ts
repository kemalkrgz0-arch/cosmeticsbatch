type DirectoryCopy = {
  title: string;
  description: (count: number) => string;
  subtitle: (count: number) => string;
  listName: string;
};

const copy: Record<string, DirectoryCopy> = {
  en: { title: "All Supported Brands", description: (n) => `Browse all ${n} cosmetic and perfume brands supported by Cosmetics Batch.`, subtitle: (n) => `Browse ${n} supported cosmetic and perfume brands and choose one to check its batch code.`, listName: "Supported cosmetic and perfume brands" },
  de: { title: "Alle unterstützten Marken", description: (n) => `Durchsuchen Sie alle ${n} von Cosmetics Batch unterstützten Kosmetik- und Parfümmarken.`, subtitle: (n) => `Entdecken Sie ${n} unterstützte Kosmetik- und Parfümmarken und wählen Sie eine Marke zur Batchcode-Prüfung.`, listName: "Unterstützte Kosmetik- und Parfümmarken" },
  es: { title: "Todas las marcas compatibles", description: (n) => `Explora las ${n} marcas de cosmética y perfume compatibles con Cosmetics Batch.`, subtitle: (n) => `Explora ${n} marcas compatibles y elige una para comprobar su código de lote.`, listName: "Marcas de cosmética y perfume compatibles" },
  it: { title: "Tutti i marchi supportati", description: (n) => `Consulta tutti i ${n} marchi di cosmetici e profumi supportati da Cosmetics Batch.`, subtitle: (n) => `Esplora ${n} marchi supportati e scegline uno per controllare il codice lotto.`, listName: "Marchi di cosmetici e profumi supportati" },
  ja: { title: "対応ブランド一覧", description: (n) => `Cosmetics Batchが対応する化粧品・香水ブランド${n}件を一覧で確認できます。`, subtitle: (n) => `対応する${n}ブランドから選び、バッチコードを確認してください。`, listName: "対応する化粧品・香水ブランド" },
  fr: { title: "Toutes les marques prises en charge", description: (n) => `Parcourez les ${n} marques de cosmétiques et de parfums prises en charge par Cosmetics Batch.`, subtitle: (n) => `Parcourez ${n} marques prises en charge et choisissez-en une pour vérifier son code de lot.`, listName: "Marques de cosmétiques et de parfums prises en charge" },
  nl: { title: "Alle ondersteunde merken", description: (n) => `Bekijk alle ${n} cosmetica- en parfummerken die Cosmetics Batch ondersteunt.`, subtitle: (n) => `Bekijk ${n} ondersteunde merken en kies er een om de batchcode te controleren.`, listName: "Ondersteunde cosmetica- en parfummerken" },
  sv: { title: "Alla varumärken som stöds", description: (n) => `Se alla ${n} kosmetik- och parfymvarumärken som stöds av Cosmetics Batch.`, subtitle: (n) => `Bläddra bland ${n} varumärken och välj ett för att kontrollera batchkoden.`, listName: "Kosmetik- och parfymvarumärken som stöds" },
  da: { title: "Alle understøttede mærker", description: (n) => `Se alle ${n} kosmetik- og parfumemærker, som Cosmetics Batch understøtter.`, subtitle: (n) => `Gennemse ${n} understøttede mærker, og vælg et for at kontrollere batchkoden.`, listName: "Understøttede kosmetik- og parfumemærker" },
  ko: { title: "지원 브랜드 전체", description: (n) => `Cosmetics Batch가 지원하는 화장품·향수 브랜드 ${n}개를 확인하세요.`, subtitle: (n) => `지원 브랜드 ${n}개 중 하나를 선택해 배치 코드를 확인하세요.`, listName: "지원되는 화장품 및 향수 브랜드" },
  ar: { title: "جميع العلامات التجارية المدعومة", description: (n) => `تصفح جميع علامات مستحضرات التجميل والعطور التي يدعمها Cosmetics Batch وعددها ${n}.`, subtitle: (n) => `تصفح ${n} علامة مدعومة واختر واحدة للتحقق من رمز الدفعة.`, listName: "علامات مستحضرات التجميل والعطور المدعومة" },
  pt: { title: "Todas as marcas compatíveis", description: (n) => `Explore todas as ${n} marcas de cosméticos e perfumes compatíveis com o Cosmetics Batch.`, subtitle: (n) => `Explore ${n} marcas compatíveis e escolha uma para verificar o código de lote.`, listName: "Marcas de cosméticos e perfumes compatíveis" },
  tr: { title: "Desteklenen Tüm Markalar", description: (n) => `Cosmetics Batch tarafından desteklenen ${n} kozmetik ve parfüm markasının tamamını inceleyin.`, subtitle: (n) => `Desteklenen ${n} markayı inceleyin ve parti kodunu kontrol etmek için bir marka seçin.`, listName: "Desteklenen kozmetik ve parfüm markaları" },
  vi: { title: "Tất cả thương hiệu được hỗ trợ", description: (n) => `Xem tất cả ${n} thương hiệu mỹ phẩm và nước hoa được Cosmetics Batch hỗ trợ.`, subtitle: (n) => `Duyệt ${n} thương hiệu được hỗ trợ và chọn một thương hiệu để kiểm tra mã lô.`, listName: "Thương hiệu mỹ phẩm và nước hoa được hỗ trợ" },
  id: { title: "Semua merek yang didukung", description: (n) => `Lihat semua ${n} merek kosmetik dan parfum yang didukung Cosmetics Batch.`, subtitle: (n) => `Telusuri ${n} merek yang didukung dan pilih satu untuk memeriksa kode batch.`, listName: "Merek kosmetik dan parfum yang didukung" },
  pl: { title: "Wszystkie obsługiwane marki", description: (n) => `Przeglądaj wszystkie ${n} marki kosmetyków i perfum obsługiwane przez Cosmetics Batch.`, subtitle: (n) => `Przeglądaj ${n} obsługiwanych marek i wybierz jedną, aby sprawdzić kod partii.`, listName: "Obsługiwane marki kosmetyków i perfum" },
  ru: { title: "Все поддерживаемые бренды", description: (n) => `Просмотрите все ${n} брендов косметики и парфюмерии, поддерживаемых Cosmetics Batch.`, subtitle: (n) => `Выберите один из ${n} поддерживаемых брендов, чтобы проверить батч-код.`, listName: "Поддерживаемые бренды косметики и парфюмерии" },
  zh: { title: "所有支持的品牌", description: (n) => `浏览 Cosmetics Batch 支持的全部 ${n} 个化妆品和香水品牌。`, subtitle: (n) => `浏览 ${n} 个支持的品牌，并选择一个品牌查询批号。`, listName: "支持的化妆品和香水品牌" },
  yue: { title: "所有支援品牌", description: (n) => `瀏覽 Cosmetics Batch 支援嘅全部 ${n} 個化妝品同香水品牌。`, subtitle: (n) => `瀏覽 ${n} 個支援品牌，揀一個品牌查詢批次代碼。`, listName: "支援嘅化妝品同香水品牌" },
};

export function brandsDirectoryCopy(locale: string): DirectoryCopy {
  return copy[locale] ?? copy.en;
}
