export class ProductModel {
  public constructor(
    public productId?: number,
    public campaignId?: number,
    public clientId?: number,
    public productTypeId?: number,
    public successRates?: number,
    public images?: {
      img1?: string,
      img2?: string,
      img3?: string,
      img4?: string,
      img5?: string,
      img6?: string,
      img7?: string,
      img8?: string,
      img9?: string,
      img10?: string,
      img11?: string,
      img12?: string,
      img13?: string,
      img14?: string,
      img15?: string,
    }
  ) { }
}
