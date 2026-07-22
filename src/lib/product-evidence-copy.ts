export type ProductEvidenceCopy = {
  productName: string;
  ean: string;
  pao: string;
  consent: string;
  received: string;
};

const RAW: Record<string, readonly [string, string, string, string, string]> = {
  en: [
    "Product name (optional)",
    "EAN / GTIN (optional)",
    "PAO shown on the package, e.g. 12M (optional)",
    "I confirm these are my photos and allow Cosmetics Batch to privately store the product details and photos for batch-code and packaging research. No faces or personal details are visible.",
    "Thanks. Your anonymous packaging contribution was received.",
  ],
  tr: [
    "Ürün adı (isteğe bağlı)",
    "EAN / GTIN (isteğe bağlı)",
    "Ambalajda görünen PAO, ör. 12M (isteğe bağlı)",
    "Bunların kendi fotoğraflarım olduğunu onaylıyor; ürün bilgileri ile fotoğrafların batch kodu ve ambalaj araştırması için Cosmetics Batch tarafından özel olarak saklanmasına izin veriyorum. Yüz veya kişisel bilgi görünmüyor.",
    "Teşekkürler. Anonim ambalaj katkınız alındı.",
  ],
  de: ["Produktname (optional)", "EAN / GTIN (optional)", "PAO auf der Verpackung, z. B. 12M (optional)", "Ich bestätige, dass dies meine Fotos sind, und erlaube Cosmetics Batch, Produktangaben und Fotos privat für die Chargencode- und Verpackungsforschung zu speichern. Es sind keine Gesichter oder persönlichen Daten sichtbar.", "Vielen Dank. Ihr anonymer Verpackungsbeitrag ist eingegangen."],
  es: ["Nombre del producto (opcional)", "EAN / GTIN (opcional)", "PAO indicado en el envase, p. ej. 12M (opcional)", "Confirmo que estas fotos son mías y autorizo a Cosmetics Batch a guardar de forma privada los datos del producto y las fotos para investigar códigos de lote y envases. No aparecen rostros ni datos personales.", "Gracias. Hemos recibido tu contribución anónima sobre el envase."],
  it: ["Nome del prodotto (facoltativo)", "EAN / GTIN (facoltativo)", "PAO indicato sulla confezione, ad es. 12M (facoltativo)", "Confermo che queste foto sono mie e autorizzo Cosmetics Batch a conservare privatamente i dati del prodotto e le foto per la ricerca sui codici di lotto e sulle confezioni. Non sono visibili volti o dati personali.", "Grazie. Il tuo contributo anonimo sulla confezione è stato ricevuto."],
  ja: ["製品名（任意）", "EAN / GTIN（任意）", "パッケージに表示されたPAO（例：12M、任意）", "これらが自分の写真であることを確認し、バッチコードとパッケージの調査のために、製品情報と写真を非公開で保存することを Cosmetics Batch に許可します。顔や個人情報は写っていません。", "ありがとうございます。匿名のパッケージ情報を受け付けました。"],
  fr: ["Nom du produit (facultatif)", "EAN / GTIN (facultatif)", "PAO indiqué sur l’emballage, par ex. 12M (facultatif)", "Je confirme que ces photos sont les miennes et j’autorise Cosmetics Batch à conserver de manière privée les informations produit et les photos pour la recherche sur les codes de lot et les emballages. Aucun visage ni détail personnel n’est visible.", "Merci. Votre contribution anonyme sur l’emballage a bien été reçue."],
  nl: ["Productnaam (optioneel)", "EAN / GTIN (optioneel)", "PAO op de verpakking, bijv. 12M (optioneel)", "Ik bevestig dat dit mijn foto's zijn en geef Cosmetics Batch toestemming om de productgegevens en foto's privé op te slaan voor onderzoek naar batchcodes en verpakkingen. Er zijn geen gezichten of persoonlijke gegevens zichtbaar.", "Bedankt. Uw anonieme verpakkingsbijdrage is ontvangen."],
  sv: ["Produktnamn (valfritt)", "EAN / GTIN (valfritt)", "PAO på förpackningen, t.ex. 12M (valfritt)", "Jag bekräftar att detta är mina foton och tillåter Cosmetics Batch att lagra produktuppgifter och foton privat för forskning om batchkoder och förpackningar. Inga ansikten eller personuppgifter syns.", "Tack. Ditt anonyma förpackningsbidrag har tagits emot."],
  da: ["Produktnavn (valgfrit)", "EAN / GTIN (valgfrit)", "PAO på emballagen, f.eks. 12M (valgfrit)", "Jeg bekræfter, at dette er mine fotos, og giver Cosmetics Batch tilladelse til at opbevare produktoplysninger og fotos privat til forskning i batchkoder og emballage. Ingen ansigter eller personlige oplysninger er synlige.", "Tak. Dit anonyme emballagebidrag er modtaget."],
  ko: ["제품명(선택)", "EAN / GTIN(선택)", "포장에 표시된 PAO, 예: 12M(선택)", "이 사진들이 본인의 사진임을 확인하며, 배치 코드와 포장 연구를 위해 Cosmetics Batch가 제품 정보와 사진을 비공개로 저장하는 데 동의합니다. 얼굴이나 개인 정보는 보이지 않습니다.", "감사합니다. 익명 포장 정보가 접수되었습니다."],
  ar: ["اسم المنتج (اختياري)", "EAN / GTIN (اختياري)", "PAO الظاهر على العبوة، مثل 12M (اختياري)", "أؤكد أن هذه صوري وأسمح لـ Cosmetics Batch بتخزين معلومات المنتج والصور بشكل خاص لأبحاث رموز التشغيلات والعبوات. لا تظهر وجوه أو معلومات شخصية.", "شكرًا. تم استلام مساهمتك المجهولة بشأن العبوة."],
  pt: ["Nome do produto (opcional)", "EAN / GTIN (opcional)", "PAO indicado na embalagem, por ex. 12M (opcional)", "Confirmo que estas fotos são minhas e autorizo a Cosmetics Batch a guardar de forma privada os dados do produto e as fotos para pesquisa de códigos de lote e embalagens. Não aparecem rostos nem dados pessoais.", "Obrigado. A sua contribuição anónima sobre a embalagem foi recebida."],
  vi: ["Tên sản phẩm (không bắt buộc)", "EAN / GTIN (không bắt buộc)", "PAO ghi trên bao bì, ví dụ 12M (không bắt buộc)", "Tôi xác nhận đây là ảnh của mình và cho phép Cosmetics Batch lưu trữ riêng tư thông tin sản phẩm cùng ảnh để nghiên cứu mã lô và bao bì. Ảnh không có khuôn mặt hoặc thông tin cá nhân.", "Cảm ơn. Đóng góp bao bì ẩn danh của bạn đã được tiếp nhận."],
  id: ["Nama produk (opsional)", "EAN / GTIN (opsional)", "PAO pada kemasan, mis. 12M (opsional)", "Saya mengonfirmasi bahwa foto-foto ini milik saya dan mengizinkan Cosmetics Batch menyimpan detail produk serta foto secara privat untuk penelitian kode batch dan kemasan. Tidak ada wajah atau data pribadi yang terlihat.", "Terima kasih. Kontribusi kemasan anonim Anda telah diterima."],
  pl: ["Nazwa produktu (opcjonalnie)", "EAN / GTIN (opcjonalnie)", "PAO na opakowaniu, np. 12M (opcjonalnie)", "Potwierdzam, że są to moje zdjęcia, i zezwalam Cosmetics Batch na prywatne przechowywanie danych produktu oraz zdjęć do badań nad kodami partii i opakowaniami. Nie widać twarzy ani danych osobowych.", "Dziękujemy. Otrzymaliśmy anonimowy wkład dotyczący opakowania."],
  ru: ["Название продукта (необязательно)", "EAN / GTIN (необязательно)", "PAO на упаковке, например 12M (необязательно)", "Я подтверждаю, что это мои фотографии, и разрешаю Cosmetics Batch хранить данные о продукте и фотографии в закрытом виде для исследования кодов партий и упаковки. На снимках нет лиц или персональных данных.", "Спасибо. Ваш анонимный материал об упаковке получен."],
  zh: ["产品名称（可选）", "EAN / GTIN（可选）", "包装上标示的 PAO，例如 12M（可选）", "我确认这些照片由我拍摄，并允许 Cosmetics Batch 私下保存产品信息和照片，用于批号及包装研究。照片中不含人脸或个人信息。", "谢谢。我们已收到您的匿名包装资料。"],
  yue: ["產品名稱（可選）", "EAN / GTIN（可選）", "包裝上標示嘅 PAO，例如 12M（可選）", "我確認呢啲相係由我拍攝，並同意 Cosmetics Batch 私下保存產品資料同相片，用作批次碼及包裝研究。相片入面冇人樣或個人資料。", "多謝。我哋已收到你嘅匿名包裝資料。"],
};

export function productEvidenceCopy(locale: string): ProductEvidenceCopy {
  const values = RAW[locale] ?? RAW.en;
  return {
    productName: values[0],
    ean: values[1],
    pao: values[2],
    consent: values[3],
    received: values[4],
  };
}

export const PRODUCT_EVIDENCE_LOCALES = Object.freeze(Object.keys(RAW));
