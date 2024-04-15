import { Response } from "express";
import { join } from "path";

export const sendView = (res: Response, status: number, path: string, variables?: {}) => {
    if(path.includes('error')) {
        return res.status(status).render(join(__dirname, `../../views/errors/${path}-${status}.ejs`), { ...variables });
    } else if ((path.includes('create-') || path.includes('list-') || path.includes('update-') || path.includes('delete-') || path.includes('details-')) && !path.includes('/')){
        const section = path.split('-')[1];
        return res.status(status).render(join(__dirname, `../../views/management/${section}s/${path}.ejs`), { ...variables });
    } else if (path.includes('admin')){
        return res.status(status).render(join(__dirname, `../../views/management/dashboard.ejs`), { ...variables });
    } else if (path.includes('signin') || path.includes('signup')){
        return res.status(status).render(join(__dirname, `../../views/sign/${path}.ejs`), { ...variables });
    } else if (path.includes('/')){
        return res.status(status).redirect(`${path}`);
    } else {
        return res.status(status).render(join(__dirname, `../../views/${path}.ejs`), { ...variables });
    }
}