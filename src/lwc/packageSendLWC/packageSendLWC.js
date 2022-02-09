import {LightningElement, track} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import getPickListValues from '@salesforce/apex/PackageSendController.getPickListValue';
import getPostOfficesOptions from '@salesforce/apex/PackageSendController.getPostOffices';
import savePackages from '@salesforce/apex/PackageSendController.savePackages';

export default class PackageSendLwc extends LightningElement {
    @track newPackages;
    sizeOptions;
    weightOptions;
    typeOptions;
    postOfficesOptions;

    connectedCallback() {
        this.loadPickListsOptions();
    }

    loadPickListsOptions() {
        getPickListValues()
            .then(result => {
                let pickListsOptions = JSON.parse(result);
                this.sizeOptions = pickListsOptions.Size__c;
                this.weightOptions = pickListsOptions.Weight__c;
                this.typeOptions = pickListsOptions.Type__c;
                this.loadPostOfficesOptions();
            })
            .catch(error => {
                this.showErrorToast(error.message);
            });
    }

    loadPostOfficesOptions() {
        getPostOfficesOptions()
            .then(result => {
                let postOffices = [];
                result.forEach(function (postOffice) {
                    postOffices.push({label: postOffice.Name, value: postOffice.Id});
                })
                this.postOfficesOptions = postOffices;
                this.setDefaultPackage();
            })
            .catch(error => {
                this.showErrorToast(error.message);
            });
    }

    setDefaultPackage() {
        this.newPackages = [{
            'Size__c': this.sizeOptions[0].value,
            'Weight__c': this.weightOptions[0].value,
            'Type__c': this.typeOptions[0].value,
            'Sent_from__c': this.postOfficesOptions[0].value,
            'Sent_to__c': this.postOfficesOptions[0].value,
        }];
    }

    handleInputChange(event) {
        switch (event.target.dataset.field) {
            case 'Size':
                this.newPackages[event.target.name].Size__c = event.target.value;
                break;
            case 'Weight':
                this.newPackages[event.target.name].Weight__c = event.target.value;
                break;
            case 'Type':
                this.newPackages[event.target.name].Type__c = event.target.value;
                break;
            case 'Sent_from':
                this.newPackages[event.target.name].Sent_from__c = event.target.value;
                break;
            case 'Sent_to':
                this.newPackages[event.target.name].Sent_to__c = event.target.value;
                break;
        }
    }

    handleDeliveryPriceChangeAndPrepareToSavePackages() {
        let deliveryPriceElements = this.template.querySelectorAll(".delivery-price-input");
        for (let i = 0; i < this.newPackages.length; i++) {
            this.newPackages[i].Delivery_Price__c = deliveryPriceElements[i].value;
        }
        this.prepareToSavePackages();
    }

    showErrorToast(message) {
        const evt = new ShowToastEvent({
            title: 'Error!',
            message: message,
            variant: 'error',
        });
        this.dispatchEvent(evt);
    }

    prepareToSavePackages() {
        savePackages({new_packages: JSON.stringify(this.newPackages)})
            .then(() => {
                this.setDefaultPackage();
                this.showSuccessToast("The packages has been saved successfully.")
            })
            .catch(error => {
                this.showErrorToast("Can't deliver long road.");
            });
    }

    addNewRow() {
        if (this.sizeOptions.length && this.weightOptions.length && this.typeOptions.length && this.postOfficesOptions.length) {
            this.newPackages.push({
                'Size__c': this.sizeOptions[0].value,
                'Weight__c': this.weightOptions[0].value,
                'Type__c': this.typeOptions[0].value,
                'Delivery_Price__c': '',
                'Sent_from__c': this.postOfficesOptions[0].value,
                'Sent_to__c': this.postOfficesOptions[0].value,
            });
        } else {
            this.showErrorToast("New Row can not be created");
        }
    }

    showSuccessToast(message) {
        const evt = new ShowToastEvent({
            title: 'Success!',
            message: message,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}