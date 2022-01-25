public without sharing class DeliveryTriggerHandler {

    public static void beforeInsert(List<Delivery__c> newDeliveries) {
        DeliveryCheckerForUniqueness.checkForNotUniqueDeliveries(newDeliveries);
    }

    public static void afterInsert(List<Delivery__c> newDeliveries) {
        PackageDeliveryFieldSetter.setDeliveryFieldOfPackages(newDeliveries);
    }

}