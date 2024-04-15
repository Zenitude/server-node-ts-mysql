import { escape } from 'validator';

export const cleanValue = (value: any) => {
    if(!value) return "";
    const str = value.trim();
    const escValue = escape(str);
    const finalValue = 
        escValue.replace(/<[^>]*>/g, '') 
        .replace(/&lt;/g, '') // remplace <
        .replace(/&gt;/g, '') // remplace >
        .replace(/&amp;/g, '') // remplace &
        .replace(/&quot;/g, '') // remplace "
        .replace(/&#039;/g, '') // remplace '
        .replace(/&#x2F;/g, ''); // remplace /
    return finalValue;
}