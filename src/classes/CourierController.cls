public without sharing class CourierController {
    private static final Integer MAX_DISTANCE = 100;

    @AuraEnabled
    public static Boolean prepareAndInsertDeliveries() {
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
            return false;
        } else if (!(newUniqueDeliveries.isEmpty())) {
            insert newUniqueDeliveries;
            return true;
        } else {
            return false;
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
                Sender__c = :[
                        SELECT Id
                        from Post_Office__c
                        where Name = :sender
                ].Id
                AND
                Receiver__c = :[
                        SELECT Id
                        from Post_Office__c
                        where Name = :receiver
                ].Id
                LIMIT 1];
    }

    @AuraEnabled
    public static Map<String, Post_Office__c> findPostOfficesByDelivery(Delivery__c delivery) {
        return new Map<String, Post_Office__c> {'sender' => [
                                                    SELECT Name, Id
                                                    FROM Post_Office__c
                                                    WHERE Id = :delivery.Sender__c],
                                                'receiver' => [
                                                    SELECT Name, Id
                                                    FROM Post_Office__c
                                                    WHERE Id = :delivery.Receiver__c]};
    }

    @AuraEnabled
    public static List<Package__c> findPackagesByDelivery(Delivery__c delivery) {
        return [
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id
        ];
    }

    @AuraEnabled
    public static List<Package__c> findWaitingToPickUpPackagesByDelivery(Delivery__c delivery) {
        return [
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Waiting to pick up'
        ];
    }

    @AuraEnabled
    public static List<Package__c> findDeliveringPackagesByDelivery(Delivery__c delivery) {
        return [
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Delivering'
        ];
    }

    @AuraEnabled
    public static List<Package__c> findDeliveredButNotPaidPackagesByDelivery(Delivery__c delivery) {
        return [
                SELECT Name, Id, Delivery_Price__c, Status__c, Accepted_Datetime__c, Paid__c, Size__c, Type__c, Weight__c
                FROM Package__c
                WHERE Delivery__c = :delivery.Id AND Status__c = 'Received by post office' AND Paid__c = FALSE
        ];
    }

    @AuraEnabled
    public static void updatePackages(List<Package__c> packages) {
        update packages;
    }
}