export class ShopParams {
    brandId: number | undefined =0;
    typeId: number | undefined =0;
    sort: string = 'name';
    pageNumber: number | undefined = 1;
    pageSize: number | undefined = 6;
    search: string | undefined;
}