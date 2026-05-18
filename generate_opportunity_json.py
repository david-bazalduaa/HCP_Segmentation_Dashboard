import pandas as pd
import json

def generate_json():
    # Load data
    try:
        df_prop = pd.read_parquet('hcp_propensity_results.parquet')
        df_hcp = pd.read_parquet('hcp_analysis_clean.parquet')
    except Exception as e:
        print(f"Error loading parquet files: {e}")
        return

    # Ensure NUEVO_ID is a column in df_hcp
    if 'NUEVO_ID' not in df_hcp.columns:
        if df_hcp.index.name == 'NUEVO_ID':
            df_hcp = df_hcp.reset_index()
        else:
            print("NUEVO_ID not found in hcp_analysis_clean.parquet")
            return
            
    # Convert NUEVO_ID to string in both dataframes to avoid merge conflicts
    df_prop['NUEVO_ID'] = df_prop['NUEVO_ID'].astype(str)
    df_hcp['NUEVO_ID'] = df_hcp['NUEVO_ID'].astype(str)
    
    # Merge datasets
    # We only want to generate JSON for HCPs that are in the propensity results
    df_merged = pd.merge(df_prop, df_hcp, on='NUEVO_ID', how='inner')
    
    no_visits = []
    covered = []
    
    for _, row in df_merged.iterrows():
        # Using .get() with defaults in case of missing data to prevent errors
        record = {
            "id": str(int(row['NUEVO_ID'])),
            "uc": round(float(row.get('UC_TRX_mean', 0.0) if pd.notna(row.get('UC_TRX_mean')) else 0.0), 4),
            "sc": round(float(row.get('propensity_score', 0.0) if pd.notna(row.get('propensity_score')) else 0.0), 4),
            "sp": str(row.get('SPECIALTY', 'Unknown')),
            "ap": round(float(row.get('UC_TRX_active_pct', 0.0) if pd.notna(row.get('UC_TRX_active_pct')) else 0.0) * 100, 1)
        }
        
        # Check if covered or not
        details_ever = float(row.get('DETAILS_ever', 0.0) if pd.notna(row.get('DETAILS_ever')) else 0.0)
        
        if details_ever > 0:
            covered.append(record)
        else:
            no_visits.append(record)
            
    final_data = {
        "noVisits": no_visits,
        "covered": covered
    }
    
    with open('opportunity_data.json', 'w') as f:
        json.dump(final_data, f)
    
    print(f"Successfully generated 'opportunity_data.json'.")
    print(f"Total processed: {len(df_merged)}")
    print(f"- noVisits: {len(no_visits)}")
    print(f"- covered: {len(covered)}")

if __name__ == "__main__":
    generate_json()
