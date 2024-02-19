interface GnWebApiResponseBase{
    TotalMilliseconds: number
    Warning : Array<string>
}
interface GnSearchResponse extends GnWebApiResponseBase{
    GroupNo: number
    Groups: Array<GnSearchGroup>
    Statistics: GnStatGroup
    SuggestedTerms:Array<string>
    RelationalTerms:Array<string>
}
export interface GnSearchGroup{
    GroupIndex: number
    GroupName: string
    DocNo: number
    Docs: Array<GnSearchDoc>
}
interface GnSearchDoc{
    DocIndex: number
    DocFieldValues: Record<string, string>
    DocAbstract : string
}
interface GnStatGroup{
    FieldName: string
    Statistics: Array<GnStatResult>
}
interface GnStatResult{
    FieldValueInterval:string
    Count:number
}
export interface RuleForm {
    searchMode: string,
    searchRange: string,
    count: number,
    date1: string,
    date2: string,
    delivery: boolean,
    type: [],
    resource: string,
    desc: string,
}
export interface ResponseData{
    message: string
    data: data
}
interface data{
    token: string
}

export interface Product{
    id:number,
    title:string,
    price:number,
    titlepic:string,
    otherpic:string,
    newprice:number,
    createDate: Date,
    isFavorite:boolean
}
