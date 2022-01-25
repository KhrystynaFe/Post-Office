public with sharing class DeliveryCheckerForUniqueness {
    public static void checkForNotUniqueDeliveries(List<Delivery__c> newDeliveries) {
        List<Delivery__c> allDeliveries = [SELECT Receiver__c, Sender__c FROM Delivery__c];
        for (Delivery__c newDelivery : newDeliveries) {
            for (Delivery__c alreadyCreatedDelivery : allDeliveries) {
                if (alreadyCreatedDelivery.Sender__c == newDelivery.Sender__c
                        && alreadyCreatedDelivery.Receiver__c == newDelivery.Receiver__c) {
                    newDelivery.addError('Delivery is not unique');
                }
            }
        }
    }
}