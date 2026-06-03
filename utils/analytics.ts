
export const track_calculation = (average: number, modulesCount: number, isPassed: boolean) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'calculate_grade', {
      final_score: average.toFixed(2),
      module_count: modulesCount,
      passed_status: isPassed ? 'Admis' : 'Ajourné',
    });
  }
};

export const track_pdf_export = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'export_pdf', {});
  }
};

export const track_contact_open = () => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'open_contact_modal', {});
  }
};

export const track_platform_click = (platformName: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'click_social_platform', {
      platform: platformName
    });
  }
};
