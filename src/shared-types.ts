export interface GroupModel {
  groupId: number;
  groupName: string;
}

export interface LocationData {
  TotalCount: string;
}

export interface GenericModalProps {
  title: string;
  buttonText?: string;
  isOpen?: boolean;
}

export type ApiDates = {
  startDateInt: number;
  endDateInt: number;
  startDate: Date;
  endDate: Date;
}

export interface ApiError {
  code: number;
  message: string;
}
export interface GoogleRankingData {
  KeywordRanks: { [x: string]: number };
  LatestOverallScore: number;
}

export enum RecommendationActionType {
  Inprogress,
  Ignore,
  ToDo
}
export interface RecomendationRequest {
  ActionsType: RecommendationActionType;
  Keyword: string;
  UserId: string;
  AccountId: string;
  ImpersonatorEmail: string;
  ImpersonatorName: string;
  UserName: string;
  UserEmail: string;
}
export interface SideMenuItem {
  href: string;
  icon: string;
  title: string;
  toolTip: string;
  isLinkActive: boolean;
  subMenus?: SideMenuItem[];
}

export type AlertSuccess = (title: string) => void;

export type AlertError = (title: string) => void;

export type AlertInfo = (title: string) => void;

export type SwoopFeatureType =
  | "visibilityReport"
  | "accuracyReport"
  | "contentAnalysis"
  | "reviewReport"
  | "vendorReports"
  | "respondtoReviews"
  | "googleRankingReport"
  | "customerFeedback"
  | "reportCard"
  | "frequentKeywords"
  | "sentimentAnalysis"
  | "competitiveAnalysisAccuracyReport"
  | "competitiveAnalysisContentAnalysisReport"
  | "competitiveAnalysisReviewReport"
  | "competitiveAnalysisVisibilityReport"
  | "socialMonitoring"
  | "socialPublishing"
  | "googleQandAMonitoring"
  | "feedbackEmbeddedCode"
  | "duplicateManagement"
  | "googleQandAPublishing"
  | "googleQandA"
  | "dataSyndication"
  | "feedbackWidget"
  | "feedbackAPIDataAnywhere"
  | "respondToReviewsAssistant"
  | "maximizer"
  | "localRankPlusPassiveReporting"
  | "localRankPlus"
  | "syndicationStatusReport"
  | "listingVerification";

export type SwoopOptionType =
  | "Bing"
  | "Yahoo"
  | "YP.ca"
  | "Yelp"
  | "Facebook"
  | "Foursquare"
  | "YP.com"
  | "Superpages"
  | "GlassDoor"
  | "CitySearch"
  | "Merchantcircle"
  | "HomeStars"
  | "Indeed"
  | "Yell"
  | "Scoot"
  | "Touch Local"
  | "AppleMaps"
  | "Zomato"
  | "FoursquareApi"
  | "Yahoo UK & Ireland"
  | "PagesJaunes"
  | "Mappy"
  | "TripAdvisor"
  | "OpenTable"
  | "Google"
  | "Bing Places for Business Report"
  | "Foursquare Report"
  | "Facebook Insights Report"
  | "Google My Business Report"
  | "Google API"
  | "Facebook API"
  | "Google Ranking Report"
  | "Review Solicitation"
  | "Report Card"
  | "Sentiment Analysis"
  | "Syndication Status Report"
  | "Feedback Embedded Code"
  | "Google My Business"
  | "Feedback Widget"
  | "Frequent Keywords"
  | "Google Ranking Plus"
  | "Feedback API DataAnywhere"
  | "Transmission"
  | "Apple"
  | "Brownbook"
  | "Clinia"
  | "Cylex"
  | "eLocal.com"
  | "Factual"
  | "HERE"
  | "Industry Canada"
  | "Data Axle"
  | "Judy's Book"
  | "Justacot?"
  | "Les Horaires"
  | "LSSI"
  | "Manta"
  | "Maple Tech"
  | "Mechanic Advisor"
  | "Soleo"
  | "Solocal"
  | "TomTom"
  | "Trucker Path"
  | "Yalwa"
  | "Instagram"
  | "Twitter"
  | "YouTube"
  | "Maximizer"
  | "Listing Verification"
  | "Snap Map"
  | "Store Locate"
  | "Thryv";

/** Swoop pfos models */
export type Operand = "And" | "Or";

type SwoopFeatureOptionsObject = {
  [key in SwoopFeatureType]?: SwoopOptionType[];
};
export interface SwoopFeatureOptions extends SwoopFeatureOptionsObject {
  operand?: Operand;
}
