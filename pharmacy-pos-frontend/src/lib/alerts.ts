import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

/**
 * Check if the current UI is in dark mode
 */
function isDarkMode(): boolean {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark')
  );
}

/**
 * Get base theme styling config for SweetAlert2
 */
function getSwalBaseOptions(): SweetAlertOptions {
  const isDark = isDarkMode();

  return {
    background: isDark ? '#131B2A' : '#FFFFFF',
    color: isDark ? '#F1F5F9' : '#0F172A',
    backdrop: `rgba(15, 23, 42, ${isDark ? '0.75' : '0.4'})`,
    customClass: {
      popup: `rounded-3xl border ${isDark ? 'border-[#223049]' : 'border-slate-200'} shadow-2xl p-6 font-sans`,
      title: 'text-lg font-black tracking-tight text-slate-900 dark:text-white',
      htmlContainer: 'text-xs leading-relaxed text-slate-600 dark:text-slate-300',
      confirmButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50',
      cancelButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-all mx-1.5 focus:outline-none',
      input:
        'rounded-2xl border border-slate-300 dark:border-[#223049] dark:bg-[#0B0F17] dark:text-white p-3 text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none font-sans',
    },
    buttonsStyling: false,
  };
}

/**
 * Display a Success Alert Modal
 */
export async function showSuccessAlert(title: string, text?: string): Promise<void> {
  const base = getSwalBaseOptions();
  await Swal.fire({
    ...base,
    icon: 'success',
    title,
    text,
    confirmButtonText: 'حسناً',
  });
}

/**
 * Display an Error Alert Modal
 */
export async function showErrorAlert(title: string, text?: string): Promise<void> {
  const base = getSwalBaseOptions();
  await Swal.fire({
    ...base,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'إغلاق',
    customClass: {
      ...base.customClass,
      confirmButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50',
    },
  });
}

/**
 * Display a Warning Alert Modal
 */
export async function showWarningAlert(title: string, text?: string): Promise<void> {
  const base = getSwalBaseOptions();
  await Swal.fire({
    ...base,
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'فهمت ذلك',
    customClass: {
      ...base.customClass,
      confirmButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/50',
    },
  });
}

/**
 * Display a specialized, elegant Out-of-Stock Alert for POS
 */
export async function showOutOfStockAlert(productName: string): Promise<void> {
  const base = getSwalBaseOptions();
  await Swal.fire({
    ...base,
    icon: 'warning',
    title: 'الصنف غير متوفر بالمخزون!',
    html: `
      <div class="space-y-2 text-start pt-2">
        <p class="font-bold text-sm text-slate-800 dark:text-slate-100">
          💊 ${productName}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          رصيد هذا الصنف حالياً <strong>0</strong> في المخزن. لا يمكن إضافته لسلة البيع حتى يتم استلام بوليصة مشتريات جديدة أو إجراء تسوية رصيد وارد من شاشة المخزون.
        </p>
      </div>
    `,
    confirmButtonText: 'حسناً، فهمت ذلك',
    customClass: {
      ...base.customClass,
      confirmButton:
        'px-6 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50',
    },
  });
}

/**
 * Display an Info Alert Modal
 */
export async function showInfoAlert(title: string, text?: string): Promise<void> {
  const base = getSwalBaseOptions();
  await Swal.fire({
    ...base,
    icon: 'info',
    title,
    text,
    confirmButtonText: 'حسناً',
  });
}

/**
 * Display a Confirmation Dialog (returns true if confirmed, false otherwise)
 */
export async function showConfirmDialog({
  title,
  text,
  confirmButtonText = 'نعم، تأكيد',
  cancelButtonText = 'إلغاء',
  isDanger = false,
  icon = 'warning',
}: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
  icon?: SweetAlertIcon;
}): Promise<boolean> {
  const base = getSwalBaseOptions();
  const result = await Swal.fire({
    ...base,
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    customClass: {
      ...base.customClass,
      confirmButton: isDanger
        ? 'px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/50'
        : 'px-5 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md transition-all mx-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500/50',
    },
  });

  return result.isConfirmed;
}

/**
 * Display a Prompt Dialog for user text input (returns string or null if cancelled)
 */
export async function showPromptDialog({
  title,
  text,
  placeholder = 'اكتب السبب هنا...',
  confirmButtonText = 'تأكيد',
  cancelButtonText = 'إلغاء',
  inputValidator,
}: {
  title: string;
  text?: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  inputValidator?: (value: string) => string | null;
}): Promise<string | null> {
  const base = getSwalBaseOptions();
  const result = await Swal.fire({
    ...base,
    title,
    text,
    input: 'text',
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    inputValidator: (val) => {
      if (!val || val.trim().length === 0) {
        return 'هذا الحقل مطلوب!';
      }
      if (inputValidator) {
        const err = inputValidator(val);
        if (err) return err;
      }
      return null;
    },
  });

  if (result.isConfirmed && typeof result.value === 'string') {
    return result.value.trim();
  }
  return null;
}

/**
 * Display a lightweight Toast Notification at the top corner
 */
export function showToast(title: string, icon: SweetAlertIcon = 'success'): void {
  const isDark = isDarkMode();
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: isDark ? '#131B2A' : '#FFFFFF',
    color: isDark ? '#F1F5F9' : '#0F172A',
    customClass: {
      popup: `rounded-2xl border ${isDark ? 'border-[#223049]' : 'border-slate-200'} shadow-xl p-3 font-sans text-xs font-bold`,
    },
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  Toast.fire({
    icon,
    title,
  });
}
