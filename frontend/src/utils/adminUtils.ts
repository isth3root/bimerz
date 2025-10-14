export const toPersianDigits = (str: string) => str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

export const translateRole = (role: string) => {
  switch (role) {
    case 'customer': return 'مشتری';
    case 'admin': return 'ادمین';
    case 'admin-2': return 'ادمین درجه ۲';
    case 'admin-3': return 'ادمین درجه ۳';
    default: return role;
  }
};

export const formatPrice = (price: string) => {
  if (!price) return "0 ریال";
  const integerPart = String(price).split('.')[0];
  const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${formatted} ریال`;
};