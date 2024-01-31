export interface PicAndText{
    text: string;
    picInbase64: string;
}
interface Product{
    id:number,
    title:string,
    price:number,
    titlepic:string,
    otherpic:string,
    newprice:number,
    createDate: Date
}
interface ProductDetail{
    content:string,
    feature:string,
    id:number,
    option:string,
    spec:string
}
export interface ProductIdBack{
    product: Product,
    productDetail: ProductDetail
}