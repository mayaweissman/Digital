import { exec } from "child_process";
import React, { Component } from "react";
import "./campaigns.css";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ClientModel } from "../../models/clientModel";
import { getAllClients } from "../../data/clients";
import { ActionType } from "../../redux/actionType";
import { CampaignModel } from "../../models/campaignModel";
import { getAllCampaigns } from "../../data/campaigns";
import { getAllProducts } from "../../data/products";
import { ProductModel } from "../../models/productModel";
import { getProductsTypes } from "../../data/products-types";
import { ProductPopUp } from "../product-pop-up/product-pop-up";
import { NavLink } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import { ProductsType } from "../../models/productsTypeModel";

interface ReportMakerState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    selectedProducts: ProductModel[]
    productsToDisplay: ProductModel[],
    campaignsToDisplay: CampaignModel[],
    display: boolean,
    productToPopUp: ProductModel,
    productTypes: ProductsType[]
    campignToPopUp: CampaignModel,
    showLoader: boolean
}



export class Campaigns extends Component<any, ReportMakerState>{

    private unsubscribeStore: Unsubscribe;
    private filteringMenuRef = React.createRef<HTMLDivElement>();



    public constructor(props: any) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients,
            selectedCampaigns: store.getState().selectedCampaigns,
            selectedProducts: store.getState().selectedProducts,
            campaignsToDisplay: store.getState().campaignsToDisplay,
            productsToDisplay: store.getState().campaignsToDisplay,
            display: store.getState().isPopUpShow,
            productToPopUp: new ProductModel(),
            campignToPopUp: new CampaignModel(),
            productTypes: [],
            showLoader: false
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const selectedCampaigns = store.getState().selectedCampaigns;
            const selectedProducts = store.getState().selectedProducts;
            const campaignsToDisplay = store.getState().campaignsToDisplay;
            const productsToDisplay = store.getState().productsToDisplay;
            const display = store.getState().isProductsPopUpShow;
            this.setState({ selectedClients });
            this.setState({ selectedCampaigns });
            this.setState({ selectedProducts });
            this.setState({ campaignsToDisplay });
            this.setState({ productsToDisplay });
            this.setState({ display });

        })
    }


    public async componentDidMount() {
        try {
            this.setState({ showLoader: true });
            setTimeout(async () => {

                const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-campaigns/");
                const allCampaigns: CampaignModel[] = response.data.campaigns;
                Aos.init({ duration: 1000 });

                const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;

                if (store.getState().selectedCampaigns.length === 0) {
                    this.state.selectedClients.map(client => {
                        allCampaigns.map(campaign => {
                            if (campaign.clientId === client.clientId) {
                                selectedCampaigns.push(campaign);
                            }
                        })
                    })
                    this.setState({ selectedCampaigns });
                    store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });
                }
                this.setState({ showLoader: false });
                console.log(store.getState().selectedProducts);

                if (store.getState().selectedProducts.length === 0) {
                    const responseForProducts = await axios.get("http://factory-dev.landing-page-media.co.il/all-products");

                    const allProductsFromDb: ProductModel[] = responseForProducts.data.products;

                    const selectedProducts: ProductModel[] = [];
                    selectedCampaigns.map(campaign => {
                        allProductsFromDb.map(product => {
                            if (product.campaignId === campaign.campaignId) {
                                selectedProducts.push(product);

                            }
                        })
                    });

                    this.setState({ selectedProducts });
                    store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });
                }


                const responseForTypes = await axios.get("http://factory-dev.landing-page-media.co.il/all-products-types/");
                const productsTypes: ProductsType[] = responseForTypes.data.productsTypes;
                this.setState({ productTypes: productsTypes });
            }, 1000);

        }
        catch (err) {
            console.log(err.message);
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public getProductTypeName = (productTypeId: number) => {

        for (const type of this.state.productTypes) {
            if (type.productsTypeId === productTypeId) {
                return type.nameForSingle;
            }
        }

    }

    //Return colors for light button by success rates (green/yellow/red)
    public getSuccessRateColor = (successRate: number) => {
        if (successRate <= 50) {
            return "#E4002B";
        }
        else if (successRate > 50 && successRate < 80) {
            return "#FFDB48";
        }

        else if (successRate >= 80) {
            return "#1CE5A2";
        }
    }


    //Product is automaticlly sending to Pop Up by props 
    public setProductToDisplayInPopUp = (product: ProductModel, campaign: CampaignModel) => (event: any) => {
        this.setState({ productToPopUp: product });
        this.setState({ campignToPopUp: campaign });
        store.dispatch({ type: ActionType.changeDisplayForProductsPopUp });
    }


    //If campaign have product to disaply - show his name on title
    public isProductsToDisplayOnCampaign = (campaignId: number) => {
        if (this.state.productsToDisplay.length !== 0) {
            const productsToDisplay = this.state.productsToDisplay.filter(p => p.campaignId === campaignId);
            if (productsToDisplay.length === 0) {
                return false;
            }
            return true;

        }
        else {
            return true;
        }
    }

    public changeDisplayForMobileMenu = () => {
        store.dispatch({ type: ActionType.changeDisplayForMobileMenu })
    }


    public render() {
        return (
            <div className="campaigns">
                <div className="campaigns-left-filter" ref={this.filteringMenuRef}>
                    <img className="campaigns-filter-by-success-img" src="./assets/images/filter_by_date.svg" />
                    <span className="campaigns-filter-by-high">Highest first</span>
                    <span className="campaigns-separate">|</span>
                    <span className="campaigns-filter-by-low">Lowest first</span>

                    <IconButton className="filter-icon" onClick={this.changeDisplayForMobileMenu}>
                        <FilterListIcon />
                    </IconButton>
                </div>

                {this.state.campaignsToDisplay.length !== 0 && this.state.campaignsToDisplay?.map(campaign =>
                    <div className="client-in-campaigns">

                        {this.isProductsToDisplayOnCampaign(campaign.campaignId as number) && <h2>{campaign.campaignName}</h2>}
                        <div className="grid">

                            {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign" data-aos="fade-up">
                                    <img className="campaign-img" src={product.images?.img1} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>

                            )}

                            {this.state.productsToDisplay.length !== 0 && this.state.productsToDisplay?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign" data-aos="fade-up">
                                    <img className="campaign-img" src={product.images?.img1} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                        </div>
                    </div>
                )}

                {this.state.campaignsToDisplay.length === 0 && this.state.selectedCampaigns?.map(campaign =>
                    <div className="client-in-campaigns">
                        {this.isProductsToDisplayOnCampaign(campaign.campaignId as number) && <h2>{campaign.campaignName}</h2>}
                        <div className="grid">
                            {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign" data-aos="fade-up">
                                    <img className="campaign-img" src={product.images?.img1} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                            {this.state.productsToDisplay.length !== 0 && this.state.productsToDisplay?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign" data-aos="fade-up">
                                    <img className="campaign-img" src={product.images?.img1} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                        </div>
                    </div>
                )}
                <img className="up-btn" onClick={() => this.filteringMenuRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })} src="/assets/images/pink_btn_after.svg" />
                {this.state.display && <ProductPopUp campaign={this.state.campignToPopUp} product={this.state.productToPopUp} />}
            </div>
        )
    }
}