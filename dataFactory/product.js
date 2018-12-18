export const productsHK = {
  eDM: {
    productName: 'Hyper-Targeted eDM',
    quantity: '10000',
    discount: '10'
  },
  content: {
    productName: 'Four Page Spread Package - Advertorial',
    quantity: '10',
    discount: '20'
  },
  services: {
    productName: 'Translation services (English/Chinese)',
    quantity: '20',
    discount: '30'
  },
  coreSubscription: {
    silverAgent: {
      productName: 'Silver Agent Subscription',
      discount: '10',
      selectDropdown: {
        'Product Release': 'Quarterly',
        'Subscription Type': 'Agency'
      },
      addOnProducts: [
        'Silver Add-on package: 12 Premium',
        'Silver Add-on package: 16 Feature',
        'Silver Add-on package: 40 Feature',
        'Silver Add-on package: 20 Premium & 40 Feature',
        'Early Mover Bonus Add-on (Silver)'
      ]
    },
    goldAgent: {
      productName: 'Gold Agent Subscription',
      discount: '20',
      selectDropdown: {
        'Product Release': 'Upfront',
        'Subscription Type': 'Agent'
      },
      addOnProducts: [
        'Gold Add-on package: 100 Premium',
        'Gold Add-on package: 25 Premium & 50 Feature'
      ]


    }
  }

};

export const productsMY = {
  depth: {
    rookiePackage: {
      productName: 'Rookie Package',
      selectDropdown: {
        'Contract Type': 'Residential',
        'Customer Type': 'New'
      }
    }
  },

  eDM: {
    customizedEmailMarketing: {
      productName: 'Customized Email Marketing (CEM)',
      selectDropdown: {
        'Segments': '\'Property Price\', \'Annual Income\', \'Gender\''
      },
      discount: '1'
    },
    segmentedeDM: {
      productName: 'Segmented eDM',
      selectDropdown: {
        'Segments': 'Property Type'

      }
    }
  },

  package: {
    oneYearUnlimitedListing: {
      productName: 'One Year Unlimited Listing',
      selectDropdown: {
        'Tier': 'Platinum'
      }
    }
  }
};


