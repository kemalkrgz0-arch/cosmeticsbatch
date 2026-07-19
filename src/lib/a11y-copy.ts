type A11yCopy = {
  skipToContent: string;
  primaryNavigation: string;
  openMenu: string;
  closeMenu: string;
};

const copy: Record<string, A11yCopy> = {
  en: { skipToContent: "Skip to content", primaryNavigation: "Primary navigation", openMenu: "Open navigation menu", closeMenu: "Close navigation menu" },
  de: { skipToContent: "Zum Inhalt springen", primaryNavigation: "Hauptnavigation", openMenu: "Navigationsmenü öffnen", closeMenu: "Navigationsmenü schließen" },
  es: { skipToContent: "Saltar al contenido", primaryNavigation: "Navegación principal", openMenu: "Abrir menú de navegación", closeMenu: "Cerrar menú de navegación" },
  it: { skipToContent: "Vai al contenuto", primaryNavigation: "Navigazione principale", openMenu: "Apri menu di navigazione", closeMenu: "Chiudi menu di navigazione" },
  ja: { skipToContent: "コンテンツへ移動", primaryNavigation: "メインナビゲーション", openMenu: "ナビゲーションメニューを開く", closeMenu: "ナビゲーションメニューを閉じる" },
  fr: { skipToContent: "Aller au contenu", primaryNavigation: "Navigation principale", openMenu: "Ouvrir le menu de navigation", closeMenu: "Fermer le menu de navigation" },
  nl: { skipToContent: "Naar inhoud", primaryNavigation: "Hoofdnavigatie", openMenu: "Navigatiemenu openen", closeMenu: "Navigatiemenu sluiten" },
  sv: { skipToContent: "Gå till innehållet", primaryNavigation: "Huvudnavigering", openMenu: "Öppna navigeringsmenyn", closeMenu: "Stäng navigeringsmenyn" },
  da: { skipToContent: "Gå til indhold", primaryNavigation: "Primær navigation", openMenu: "Åbn navigationsmenu", closeMenu: "Luk navigationsmenu" },
  ko: { skipToContent: "콘텐츠로 건너뛰기", primaryNavigation: "기본 탐색", openMenu: "탐색 메뉴 열기", closeMenu: "탐색 메뉴 닫기" },
  ar: { skipToContent: "انتقل إلى المحتوى", primaryNavigation: "التنقل الرئيسي", openMenu: "فتح قائمة التنقل", closeMenu: "إغلاق قائمة التنقل" },
  pt: { skipToContent: "Saltar para o conteúdo", primaryNavigation: "Navegação principal", openMenu: "Abrir menu de navegação", closeMenu: "Fechar menu de navegação" },
  tr: { skipToContent: "İçeriğe geç", primaryNavigation: "Ana gezinme", openMenu: "Gezinme menüsünü aç", closeMenu: "Gezinme menüsünü kapat" },
  vi: { skipToContent: "Chuyển đến nội dung", primaryNavigation: "Điều hướng chính", openMenu: "Mở menu điều hướng", closeMenu: "Đóng menu điều hướng" },
  id: { skipToContent: "Lewati ke konten", primaryNavigation: "Navigasi utama", openMenu: "Buka menu navigasi", closeMenu: "Tutup menu navigasi" },
  pl: { skipToContent: "Przejdź do treści", primaryNavigation: "Nawigacja główna", openMenu: "Otwórz menu nawigacji", closeMenu: "Zamknij menu nawigacji" },
  ru: { skipToContent: "Перейти к содержимому", primaryNavigation: "Основная навигация", openMenu: "Открыть меню навигации", closeMenu: "Закрыть меню навигации" },
  zh: { skipToContent: "跳至内容", primaryNavigation: "主导航", openMenu: "打开导航菜单", closeMenu: "关闭导航菜单" },
  yue: { skipToContent: "跳到內容", primaryNavigation: "主要導覽", openMenu: "開啟導覽選單", closeMenu: "關閉導覽選單" },
};

export function a11yCopy(locale: string): A11yCopy {
  return copy[locale] ?? copy.en;
}
