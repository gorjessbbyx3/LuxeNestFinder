// Hawaii State Geoportal Parcel Data Integration
// Official data source: https://geoportal.hawaii.gov/datasets/parcels-hawaii-statewide/explore

interface HawaiiParcel {
  objectId: number;
  tmk: string; // Tax Map Key - unique property identifier
  county: string;
  island: string;
  district: string;
  zone: string;
  section: string;
  plat: string;
  parcel: string;
  landUse: string;
  zoning: string;
  area: number; // in square feet
  geometry: {
    coordinates: number[][];
    type: string;
  };
  address?: string;
  ownerName?: string;
  landValue?: number;
  buildingValue?: number;
  totalValue?: number;
}

interface PropertyEnrichmentData {
  tmk: string;
  parcelData: HawaiiParcel;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundaries: number[][];
  landUse: string;
  zoning: string;
  area: number;
  assessedValue: number;
  county: string;
  district: string;
}

// Hawaii State Geoportal API endpoints
const HAWAII_GEOPORTAL_API = {
  PARCELS: 'https://services2.arcgis.com/tuFQUQg1xd48W6M5/arcgis/rest/services/Parcels_Hawaii_Statewide/FeatureServer/0',
  ZONING: 'https://services2.arcgis.com/tuFQUQg1xd48W6M5/arcgis/rest/services/Zoning_Hawaii_Statewide/FeatureServer/0',
  LAND_USE: 'https://services2.arcgis.com/tuFQUQg1xd48W6M5/arcgis/rest/services/Land_Use_Hawaii/FeatureServer/0'
};

export class HawaiiParcelService {
  private readonly baseUrl = HAWAII_GEOPORTAL_API.PARCELS;
  
  /**
   * Query Hawaii State parcels by geographic bounds
   */
  async getParcelsByBounds(
    minLat: number, 
    maxLat: number, 
    minLng: number, 
    maxLng: number,
    county?: string
  ): Promise<HawaiiParcel[]> {
    try {
      const geometry = `${minLng},${minLat},${maxLng},${maxLat}`;
      const whereClause = county ? `COUNTY='${county.toUpperCase()}'` : '1=1';
      
      const queryUrl = `${this.baseUrl}/query?` + new URLSearchParams({
        where: whereClause,
        geometry: geometry,
        geometryType: 'esriGeometryEnvelope',
        spatialRel: 'esriSpatialRelIntersects',
        outFields: '*',
        returnGeometry: 'true',
        f: 'json',
        resultRecordCount: '1000'
      });

      const response = await fetch(queryUrl);
      const data = await response.json();
      
      return data.features?.map((feature: any) => ({
        objectId: feature.attributes.OBJECTID,
        tmk: feature.attributes.TMK,
        county: feature.attributes.COUNTY,
        island: feature.attributes.ISLAND,
        district: feature.attributes.DISTRICT,
        zone: feature.attributes.ZONE,
        section: feature.attributes.SECTION,
        plat: feature.attributes.PLAT,
        parcel: feature.attributes.PARCEL,
        landUse: feature.attributes.LAND_USE,
        zoning: feature.attributes.ZONING,
        area: feature.attributes.AREA_SQFT,
        geometry: feature.geometry,
        address: feature.attributes.ADDRESS,
        ownerName: feature.attributes.OWNER_NAME,
        landValue: feature.attributes.LAND_VALUE,
        buildingValue: feature.attributes.BUILDING_VALUE,
        totalValue: feature.attributes.TOTAL_VALUE
      })) || [];
      
    } catch (error) {
      console.error('Error fetching Hawaii parcel data:', error);
      return [];
    }
  }

  /**
   * Get specific parcel by TMK (Tax Map Key)
   */
  async getParcelByTMK(tmk: string): Promise<HawaiiParcel | null> {
    try {
      const queryUrl = `${this.baseUrl}/query?` + new URLSearchParams({
        where: `TMK='${tmk}'`,
        outFields: '*',
        returnGeometry: 'true',
        f: 'json'
      });

      const response = await fetch(queryUrl);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        return {
          objectId: feature.attributes.OBJECTID,
          tmk: feature.attributes.TMK,
          county: feature.attributes.COUNTY,
          island: feature.attributes.ISLAND,
          district: feature.attributes.DISTRICT,
          zone: feature.attributes.ZONE,
          section: feature.attributes.SECTION,
          plat: feature.attributes.PLAT,
          parcel: feature.attributes.PARCEL,
          landUse: feature.attributes.LAND_USE,
          zoning: feature.attributes.ZONING,
          area: feature.attributes.AREA_SQFT,
          geometry: feature.geometry,
          address: feature.attributes.ADDRESS,
          ownerName: feature.attributes.OWNER_NAME,
          landValue: feature.attributes.LAND_VALUE,
          buildingValue: feature.attributes.BUILDING_VALUE,
          totalValue: feature.attributes.TOTAL_VALUE
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching parcel by TMK:', error);
      return null;
    }
  }

  /**
   * Get luxury properties in high-value areas
   */
  async getLuxuryParcels(minValue: number = 2000000): Promise<PropertyEnrichmentData[]> {
    try {
      // Query high-value parcels across all Hawaiian islands
      const counties = ['HONOLULU', 'MAUI', 'HAWAII', 'KAUAI'];
      const allParcels: PropertyEnrichmentData[] = [];

      for (const county of counties) {
        const queryUrl = `${this.baseUrl}/query?` + new URLSearchParams({
          where: `COUNTY='${county}' AND TOTAL_VALUE >= ${minValue}`,
          outFields: '*',
          returnGeometry: 'true',
          f: 'json',
          resultRecordCount: '50',
          orderByFields: 'TOTAL_VALUE DESC'
        });

        const response = await fetch(queryUrl);
        const data = await response.json();
        
        if (data.features) {
          const countyParcels = data.features.map((feature: any) => {
            const geometry = feature.geometry;
            const centroid = this.calculateCentroid(geometry);
            
            return {
              tmk: feature.attributes.TMK,
              parcelData: {
                objectId: feature.attributes.OBJECTID,
                tmk: feature.attributes.TMK,
                county: feature.attributes.COUNTY,
                island: feature.attributes.ISLAND,
                district: feature.attributes.DISTRICT,
                zone: feature.attributes.ZONE,
                section: feature.attributes.SECTION,
                plat: feature.attributes.PLAT,
                parcel: feature.attributes.PARCEL,
                landUse: feature.attributes.LAND_USE,
                zoning: feature.attributes.ZONING,
                area: feature.attributes.AREA_SQFT,
                geometry: geometry,
                address: feature.attributes.ADDRESS,
                ownerName: feature.attributes.OWNER_NAME,
                landValue: feature.attributes.LAND_VALUE,
                buildingValue: feature.attributes.BUILDING_VALUE,
                totalValue: feature.attributes.TOTAL_VALUE
              },
              coordinates: centroid,
              boundaries: geometry.rings ? geometry.rings[0] : [],
              landUse: feature.attributes.LAND_USE,
              zoning: feature.attributes.ZONING,
              area: feature.attributes.AREA_SQFT,
              assessedValue: feature.attributes.TOTAL_VALUE,
              county: feature.attributes.COUNTY,
              district: feature.attributes.DISTRICT
            };
          });
          
          allParcels.push(...countyParcels);
        }
      }

      return allParcels.sort((a, b) => b.assessedValue - a.assessedValue);
      
    } catch (error) {
      console.error('Error fetching luxury parcels:', error);
      return [];
    }
  }

  /**
   * Calculate centroid of a polygon geometry
   */
  private calculateCentroid(geometry: any): { lat: number; lng: number } {
    if (!geometry || !geometry.rings || geometry.rings.length === 0) {
      return { lat: 21.0943, lng: -157.4983 }; // Default to Hawaii center
    }

    const ring = geometry.rings[0];
    let sumLat = 0;
    let sumLng = 0;
    
    for (const point of ring) {
      sumLng += point[0];
      sumLat += point[1];
    }
    
    return {
      lat: sumLat / ring.length,
      lng: sumLng / ring.length
    };
  }

  /**
   * Enrich property data with official parcel information
   */
  async enrichPropertyWithParcelData(
    lat: number, 
    lng: number, 
    radius: number = 0.001
  ): Promise<PropertyEnrichmentData | null> {
    try {
      const parcels = await this.getParcelsByBounds(
        lat - radius,
        lat + radius,
        lng - radius,
        lng + radius
      );

      if (parcels.length > 0) {
        // Find the closest parcel
        const closestParcel = parcels[0];
        const centroid = this.calculateCentroid(closestParcel.geometry);
        
        return {
          tmk: closestParcel.tmk,
          parcelData: closestParcel,
          coordinates: centroid,
          boundaries: closestParcel.geometry.rings ? closestParcel.geometry.rings[0] : [],
          landUse: closestParcel.landUse,
          zoning: closestParcel.zoning,
          area: closestParcel.area,
          assessedValue: closestParcel.totalValue || 0,
          county: closestParcel.county,
          district: closestParcel.district
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error enriching property with parcel data:', error);
      return null;
    }
  }
}

export const hawaiiParcelService = new HawaiiParcelService();