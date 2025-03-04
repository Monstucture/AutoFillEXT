export const siteConfigurations = {
    'alliedtrustagents.com': {
        elementMappings: {
            // Customer info
            first_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsFirstName',
            last_name: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsLastName',
            dob: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_dtInsBirthDt',
            phone: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_InsHomePhone',
            email: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtInsEmail',
            address1: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyAddress1',
            address2: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtAddress2',
            city: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyCity',
            zip: 'ContentPlaceHolderBody_ApplicantPropertyLoc1_txtPropertyZip',

            // Hard code Value
            dA: 'ContentPlaceHolderBody_QuoteBody_txtDwellingCvg',
            dB: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageBLimitCd',
            dC: 'ContentPlaceHolderBody_QuoteBody_ddlCoverageCLimitCd',
            dD: 'ContentPlaceHolderBody_QuoteBody_ddlLossOfUseCvgCd',
            dE: 'ContentPlaceHolderBody_QuoteBody_ddlLiabilityCvgCd',
            dF: 'ContentPlaceHolderBody_QuoteBody_ddlMedicalCvgCd',
            aop: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleAOPCd',
            wh: 'ContentPlaceHolderBody_QuoteBody_ddlDeductibleWindHailCd',

            // House info
            year_built: 'ContentPlaceHolderBody_QuoteBody_dtConstructionDt',
            purchase_date: 'ContentPlaceHolderBody_QuoteBody_dtHouseClosingDate',
            const_material: 'ContentPlaceHolderBody_QuoteBody_ddlConstructionTypeCd',
            foundation: 'ContentPlaceHolderBody_QuoteBody_ddlFoundationType',
            sqft: 'ContentPlaceHolderBody_QuoteBody_txtTotalAreaSqFt',
            st: 'ContentPlaceHolderBody_QuoteBody_ddlNbrFloorsCd',
            mat: 'ContentPlaceHolderBody_QuoteBody_ddlSidingType',
            roof_shape: 'ContentPlaceHolderBody_QuoteBody_ddlRoofShapeCd',
            roof_mat: 'ContentPlaceHolderBody_QuoteBody_ddlRoofType',
            roof_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovRoofYear',

            // Unique to allied website
            payplan: 'ContentPlaceHolderBody_QuoteBody_ddlPaymentPlan',
            payor: 'ContentPlaceHolderBody_QuoteBody_ddlPayorCd',
            housesize: 'ContentPlaceHolderBody_QuoteBody_ddlHouseHoldSizeCd',
            personal_statues: 'ContentPlaceHolderBody_QuoteBody_ddlMarried',
            Inspermission: 'ContentPlaceHolderBody_QuoteBody_ddlHasAssentedtoCreditScore',
            Ins_score: 'ContentPlaceHolderBody_QuoteBody_ddlCreditScore',
            heater_location: 'ContentPlaceHolderBody_QuoteBody_ddlFirstWaterHeaterLocation',
            resident_type: 'ContentPlaceHolderBody_QuoteBody_ddlResidenceType',
            usage: 'ContentPlaceHolderBody_QuoteBody_ddlUsageType',
            water_year: 'ContentPlaceHolderBody_QuoteBody_txtRenovationWaterHeaterYear',

            // Hard code no option for allied website
            option1: 'ContentPlaceHolderBody_QuoteBody_ddlAnyPersonalPropertyReplacementCvg',
            option2: 'ContentPlaceHolderBody_QuoteBody_ddlAnyBreakdownCvg',
            waterCov: 'ContentPlaceHolderBody_QuoteBody_HasPlumbingLeakageCoverage',
        },
    },

    'agents.sagesure.com': {
        elementMappings: {
            // Customer info
            first_name: 'InsuredFirstName',
            last_name: 'InsuredLastName',
            dob: 'Insured1BirthDate',
            personal_statues: 'InsuredMaritalStatus',

            // Hard code Value
            dA: 'CoverageA',
            ddA: 'CoverageADisplay',

            // React Select fields
            year_built: 'ConstructionYear',
            const_material: 'ConstructionType',
            c1: 'MasonryVeneerPercentage',
            roof_mat: 'RoofCoveringType',
            roof_year: 'ConstructionYearRoof',

            // Unique on Sagesure
            Ins_score: 'InsuranceScoreRangeEstimate',
            Laps: 'LapseInCoverage',
            Co_app: 'CoApplicantIndicator',
            PriorCarrier: 'PriorCarrierOther',
            x1: 'InsuranceScoreRangeEstimateIndicator',
            x2: 'Insured1SSNRequiredIndicator',
            x3: 'PersonalPropertyReplacementCost',
            x4: 'Trampoline'
        },
    },

    'cypress.cogisi.com': {
        elementMappings: {
            // TODO
        },
    }
}; 