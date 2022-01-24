({
    generateNewDeliveries: function (cmp) {
        let action = cmp.get("c.prepareAndInsertDeliveries");
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "ERROR") {
                let errors = response.getError();
                if (errors) {
                    this.showErrorToast(errors[0].message);
                }
            }
        });
        $A.enqueueAction(action);
    },

    setDelivery: function (cmp) {
        let action = cmp.get("c.findDelivery");
        action.setParams({"sender": (cmp.get("v.Sender")), "receiver": (cmp.get("v.Receiver"))});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.Delivery", response.getReturnValue());
            } else if (state === "ERROR") {
                this.showErrorToast("There are no deliveries with these parameters.");
            }
        });
        $A.enqueueAction(action);
    },

    setPostOffices: function (cmp) {
        let action = cmp.get("c.findPostOffices");
        action.setParams({"delivery": (cmp.get("v.Delivery"))});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length !== 0) {
                let records = response.getReturnValue();
                records.forEach(function (record) {
                    record.linkName = '/' + record.Id;
                });
                cmp.set("v.PostOfficeFrom", records[0]);
                cmp.set("v.PostOfficeTo", records[1]);
            } else if (state === "ERROR" || response.getReturnValue().length == 0) {
                this.showErrorToast("No Post offices found");
            }
        });
        $A.enqueueAction(action);
    },

    setPackages: function (cmp) {
        let action = cmp.get("c.findPackages");
        let delivery = cmp.get("v.Delivery");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length !== 0) {
                cmp.set("v.Packages", response.getReturnValue());
                this.setWaitingToPickUpPackages(cmp, delivery);
                this.setDeliveringPackages(cmp, delivery);
                this.setDeliveredButNotPaidPackages(cmp, delivery);
                this.setColumns(cmp);
            } else if (state === "ERROR" || response.getReturnValue().length == 0) {
                this.showErrorToast("No packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setWaitingToPickUpPackages: function (cmp, delivery) {
        let action = cmp.get("c.findWaitingToPickUpPackages");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length !== 0) {
                let records = response.getReturnValue();
                records.forEach(function (record) {
                    record.linkName = '/' + record.Id;
                });
                cmp.set("v.WaitingToPickUpPackages", records);
            } else if (state === "ERROR" || response.getReturnValue().length == 0) {
                this.showInfoToast("No Waiting To Pick Up Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setDeliveringPackages: function (cmp, delivery) {
        let action = cmp.get("c.findDeliveringPackages");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length !== 0) {
                let records = response.getReturnValue();
                records.forEach(function (record) {
                    record.linkName = '/' + record.Id;
                });
                cmp.set("v.DeliveringPackages", records);
            } else if (state === "ERROR" || response.getReturnValue().length == 0) {
                this.showInfoToast("No Delivering Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setDeliveredButNotPaidPackages: function (cmp, delivery) {
        let action = cmp.get("c.findDeliveredButNotPaidPackages");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS" && response.getReturnValue().length !== 0) {
                let records = response.getReturnValue();
                records.forEach(function (record) {
                    record.linkName = '/' + record.Id;
                });
                cmp.set("v.DeliveredButNotPaidPackages", records);
            } else if (state === "ERROR" || response.getReturnValue().length == 0) {
                this.showInfoToast("No Delivered But Not Paid Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setColumns: function (cmp) {
        cmp.set("v.columns", [
            {
                label: "Package Number",
                fieldName: 'linkName',
                type: 'url',
                typeAttributes: {label: {fieldName: 'Name'}, target: '_blank'}
            },
            {label: "Delivery Price", fieldName: "Delivery_Price__c", type: "currency"},
            {label: "Status", fieldName: "Status__c", type: "text"},
            {label: "Accepted Date", fieldName: "Accepted_Datetime__c", type: "date"},
            {label: "Paid", fieldName: "Paid__c", type: "boolean"},
            {label: "Size", fieldName: "Size__c", type: "number"},
            {label: "Type", fieldName: "Type__c", type: "text"},
            {label: "Weight", fieldName: "Weight__c", type: "number"}
        ]);
    },

    updateSelectedReadyToPickUpPackagesCountText: function (cmp, event) {
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.SelectedReadyToPickUpPackagesCount", selectedRows.length);
    },

    updateSelectedDeliveringPackagesCountText: function (cmp, event) {
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.SelectedDeliveringPackagesCount", selectedRows.length);
    },

    updateSelectedDeliveredButNotPaidPackagesCountText: function (cmp, event) {
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.SelectedDeliveredButNotPaidPackagesCount", selectedRows.length);
    },

    sendSelectedPackages: function (cmp) {
        let action = cmp.get("c.updatePackagesStatusToDelivering");
        action.setParams({"packages": cmp.get("v.SelectedReadyToPickUpPackages")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast("Packages were sent!");
                this.setPackages(cmp);
            }
        });
        $A.enqueueAction(action);
    },

    receiveSelectedPackages: function (cmp) {
        let action = cmp.get("c.updatePackagesStatusToReceivedByPostOffice");
        action.setParams({"packages": cmp.get("v.SelectedDeliveringPackages")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast("Packages were received!");
                this.setPackages(cmp);
            }
        });
        $A.enqueueAction(action);
    },

    makeSelectedPackagesPaid: function (cmp) {
        let action = cmp.get("c.updatePackagesPaidFieldValueToTrue");
        action.setParams({"packages": cmp.get("v.SelectedDeliveredButNotPaidPackages")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast("Packages are now ready to be taken by clients!");
                this.setPackages(cmp);
            }
        });
        $A.enqueueAction(action);
    },

    showErrorToast: function (message) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Error!",
            "message": message,
            "type": "error"
        });
        toastEvent.fire();
    },

    showSuccessToast: function (message) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": message,
            "type": "success"
        });
        toastEvent.fire();
    },

    showInfoToast: function (message) {
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "message": message,
            "type": "info"
        });
        toastEvent.fire();
    },

    showSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", true);
    },

    hideSpinner: function (cmp) {
        cmp.set("v.toggleSpinner", false);
    },

});