({
    generateNewDeliveries: function (cmp) {
        let action = cmp.get("c.prepareAndInsertDeliveries");
        action.setCallback(this, function (response) {
            let result = response.getReturnValue();
            if (result === false) {
                this.hideSpinner(cmp);
                this.showErrorToast("All possible unique Deliveries are already created");
            } else {
                this.hideSpinner(cmp);
                this.showSuccessToast("New Delivery was created!")
            }
        });
        $A.enqueueAction(action);
    },

    setDelivery: function (cmp) {
        let action = cmp.get("c.findDelivery");
        action.setParams({"sender": cmp.get("v.sender"), "receiver": cmp.get("v.receiver")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.delivery", response.getReturnValue());
                this.hideSpinner(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("There are no deliveries with these parameters.");
            }
        });
        $A.enqueueAction(action);
    },

    setPostOffices: function (cmp) {
        let action = cmp.get("c.findPostOfficesByDelivery");
        action.setParams({"delivery": cmp.get("v.delivery")});
        action.setCallback(this, function (response) {
            let state = response.getState();
            let records = response.getReturnValue();
            if (state === "SUCCESS") {
                let sender = records["sender"];
                let receiver = records["receiver"];
                sender.linkName = '/' + sender.Id;
                receiver.linkName = '/' + receiver.Id;
                cmp.set("v.postOfficeFrom", sender);
                cmp.set("v.postOfficeTo", receiver);
                this.hideSpinner(cmp);
            } else if (state === "ERROR") {
                this.showErrorToast("No Post offices found");
                this.hideSpinner(cmp);
                cmp.set("v.postOfficeFrom", 0);
                cmp.set("v.postOfficeTo", 0);
            }
        });
        $A.enqueueAction(action);
    },

    setPackages: function (cmp) {
        let action = cmp.get("c.findPackagesByDelivery");
        let delivery = cmp.get("v.delivery");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            let packages = response.getReturnValue();
            if (state === "SUCCESS" && packages && packages.length) {
                cmp.set("v.packages", packages);
                this.setWaitingToPickUpPackages(cmp, delivery);
                this.setDeliveringPackages(cmp, delivery);
                this.setDeliveredButNotPaidPackages(cmp, delivery);
                this.setColumns(cmp);
                this.hideSpinner(cmp);
            } else if (state === "ERROR" || !packages.length) {
                this.hideSpinner(cmp);
                cmp.set("v.packages", []);
                this.showErrorToast("No packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setWaitingToPickUpPackages: function (cmp, delivery) {
        let action = cmp.get("c.findWaitingToPickUpPackagesByDelivery");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            let records = response.getReturnValue();
            if (state === "SUCCESS" && records && records.length) {
                cmp.set("v.waitingToPickUpPackages", this.setRecordLinks(records));
            } else if (state === "ERROR" || !records.length) {
                cmp.set("v.waitingToPickUpPackages", []);
                this.showInfoToast("No Waiting To Pick Up Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setRecordLinks: function (records) {
        records.forEach(function (record) {
            record.linkName = '/' + record.Id;
        });
        return records;
    },

    setDeliveringPackages: function (cmp, delivery) {
        let action = cmp.get("c.findDeliveringPackagesByDelivery");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            let records = response.getReturnValue();
            if (state === "SUCCESS" && records && records.length) {
                cmp.set("v.deliveringPackages", this.setRecordLinks(records));
            } else if (state === "ERROR" || !records.length) {
                cmp.set("v.deliveringPackages", []);
                this.showInfoToast("No Delivering Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setDeliveredButNotPaidPackages: function (cmp, delivery) {
        let action = cmp.get("c.findDeliveredButNotPaidPackagesByDelivery");
        action.setParams({"delivery": delivery});
        action.setCallback(this, function (response) {
            let state = response.getState();
            let records = response.getReturnValue();
            if (state === "SUCCESS" && records && records.length) {
                cmp.set("v.deliveredButNotPaidPackages", this.setRecordLinks(records));
            } else if (state === "ERROR" || !records.length) {
                cmp.set("v.deliveredButNotPaidPackages", []);
                this.showInfoToast("No Delivered But Not Paid Packages found");
            }
        });
        $A.enqueueAction(action);
    },

    setColumns: function (cmp) {
        cmp.set("v.columns", [
            {label: "Package Number", fieldName: 'linkName', type: 'url', typeAttributes: {label: {fieldName: 'Name'}, target: '_blank'}},
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
        cmp.set("v.selectedReadyToPickUpPackagesCount", selectedRows.length);
    },

    updateSelectedDeliveringPackagesCountText: function (cmp, event) {
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.selectedDeliveringPackagesCount", selectedRows.length);
    },

    updateSelectedDeliveredButNotPaidPackagesCountText: function (cmp, event) {
        let selectedRows = event.getParam('selectedRows');
        cmp.set("v.selectedDeliveredButNotPaidPackagesCount", selectedRows.length);
    },

    sendSelectedPackages: function (cmp) {
        let action = cmp.get("c.updatePackages");
        let packages = cmp.get("v.selectedReadyToPickUpPackages");
        packages.forEach(function (item) {
            item.Status__c = "Delivering";
        });
        action.setParams({"packages": packages});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.hideSpinner(cmp);
                this.showSuccessToast("Packages were sent!");
                this.setPackages(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("Packages could not be sent");
            }
        });
        $A.enqueueAction(action);
    },

    receiveSelectedPackages: function (cmp) {
        let action = cmp.get("c.updatePackages");
        let packages = cmp.get("v.selectedDeliveringPackages");
        packages.forEach(function (item) {
            item.Status__c = "Received by post office";
        });
        action.setParams({"packages": packages});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast("Packages were received!");
                this.setPackages(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("Packages could not be received");
            }
        });
        $A.enqueueAction(action);
    },

    makeSelectedPackagesPaid: function (cmp) {
        let action = cmp.get("c.updatePackages");
        let packages = cmp.get("v.selectedDeliveredButNotPaidPackages");
        packages.forEach(function (item) {
            item.Paid__c = true;
        });
        action.setParams({"packages": packages});
        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                this.showSuccessToast("Packages are now ready to be taken by clients!");
                this.setPackages(cmp);
            } else if (state === "ERROR") {
                this.hideSpinner(cmp);
                this.showErrorToast("Packages could not be marked as paid");
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