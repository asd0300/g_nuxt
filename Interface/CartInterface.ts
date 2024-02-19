export interface Cart{
    userid:number,
    productid:number,
    numberbuy:number,
    spec:string,
    createtime:Date,
    id:number,
    title:string,
    price:number,
    newprice:number,
    titlepic:string,
    otherpic:string,
    createdate:Date,
}
export interface BackEndRes{
    clientSecret:string
}