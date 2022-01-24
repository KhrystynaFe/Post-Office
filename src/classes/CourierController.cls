public without sharing class CourierController {
    private static final Integer MAX_DISTANCE = 100;
    @AuraEnabled
    public static void prepareAndInsertDeliveries() {
        Map<Id, List<Id>> sendersAndReceivers = new Map<Id, List<Id>>();
        List<Post_Office__c> postOffices = [SELECT Id, Location__c FROM Post_Office__c];
        for (Post_Office__c sender : postOffices) {
            List<Id> receivers = new List<Id>();
            for (Post_Office__c receiver : postOffices) {
                if (Location.getDistance((Location) sender.Location__c, (Location) receiver.Location__c, 'km') < MAX_DISTANCE) {
                    receivers.add(receiver.Id);
                }
            }
            sendersAndReceivers.put(sender.Id, receivers);
        }
        List<Delivery__c> newUniqueDeliveries = new List<Delivery__c> (getUniqueDeliveries(setSenderReceiverFieldsInDeliveries(sendersAndReceivers)));
        if (newUniqueDeliveries.isEmpty()) {
            throw new AuraHandledException('All possible unique Deliveries are already created');
        } else {
            insert newUniqueDeliveries;
        }
    }

    private static List<Delivery__c> setSenderReceiverFieldsInDeliveries(Map<Id, List<Id>> sendersAndReceivers) {
        List<Delivery__c> newDeliveries = new List<Delivery__c>();
        for (Id sender : sendersAndReceivers.keySet()) {
            for (Id receiver : sendersAndReceivers.get(sender)) {
                newDeliveries.add(new Delivery__c(Sender__c = sender, Receiver__c = receiver));
            }
        }
        return newDeliveries;
    }

    private static Set<Delivery__c> getUniqueDeliveries(List<Delivery__c> newDeliveries) {
        List<Delivery__c> allDeliveries = [SELECT Receiver__c, Sender__c FROM Delivery__c];
        Set<Delivery__c> newUniqueDeliveries = new Set <Delivery__c>(newDeliveries);
        for (Delivery__c newDelivery : newDeliveries) {
            for (Delivery__c alreadyCreatedDelivery : allDeliveries) {
                if (alreadyCreatedDelivery.Sender__c == newDelivery.Sender__c
                        && alreadyCreatedDelivery.Receiver__c == newDelivery.Receiver__c) {
                    newUniqueDeliveries.remove(newDelivery);
                    break;
                }
            }
        }
        return newUniqueDeliveries;
    }

    @AuraEnabled
    public static Delivery__c findDelivery(String sender, String receiver) {
        return [
                SELECT Name, Sender__c, Receiver__c
                FROM Delivery__c
                WHERE
                Sender__c = :[SELECT Id from Post_Office__c where Name = :sender].Id AND
                Receiver__c = :[SELECT Id from Post_Office__c where Name = :receiver].Id
        ];
    }

    @AuraEnabled
    public static List<Post_Office__c> findPostOffices(Delivery__c delivery) {
        return new List<Post_Office__c>{ [SELECT Name, Id FROM Post_Office__c WHERE Id = :delivery.Sender__c], [SELECT Name, Id FROM Post_Office__c WHERE Id = :delivery.Receiver__c]
        };
    }

    @AuraEnabled
    public static List<Package__c> findPackages(Delivery__c delivery) {
        return new List<Package__c>([
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id
        ]);
    }

    @AuraEnabled
    public static List<Package__c> findWaitingToPickUpPackages(Delivery__c delivery) {
        return new List<Package__c>([
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Waiting to pick up'
        ]);
    }

    @AuraEnabled
    public static List<Package__c> findDeliveringPackages(Delivery__c delivery) {
        return new List <Package__c>([
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Delivering'
        ]);
    }

    @AuraEnabled
    public static List<Package__c> findDeliveredButNotPaidPackages(Delivery__c delivery) {
        return new List<Package__c>([
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Received by post office' AND Paid__c = FALSE
        ]);
    }

    @AuraEnabled
    public static void updatePackagesStatusToDelivering(List<Package__c> packages) {
        List<Package__c> updatedPackages = new List<Package__c>();
        for (Package__c packageToUpdate : packages) {
            packageToUpdate.Status__c = 'Delivering';
            updatedPackages.add(packageToUpdate);
        }
        update updatedPackages;
    }

    @AuraEnabled
    public static void updatePackagesStatusToReceivedByPostOffice(List<Package__c> packages) {
        List<Package__c> updatedPackages = new List<Package__c>();
        for (Package__c packageToUpdate : packages) {
            packageToUpdate.Status__c = 'Received by post office';
            updatedPackages.add(packageToUpdate);
        }
        update updatedPackages;
    }

    @AuraEnabled
    public static void updatePackagesPaidFieldValueToTrue(List<Package__c> packages) {
        List<Package__c> updatedPackages = new List<Package__c>();
        for (Package__c packageToUpdate : packages) {
            packageToUpdate.Paid__c = true;
            updatedPackages.add(packageToUpdate);
        }
        update updatedPackages;
    }
}