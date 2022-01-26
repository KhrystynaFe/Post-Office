@IsTest
public with sharing class CourierControllerTest {

    @IsTest static void generatingUniqueDelivery() {
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Test.startTest();
        Boolean result = CourierController.prepareAndInsertDeliveries();
        Test.stopTest();
        System.assertEquals(result, true);
    }

    @IsTest static void generatingNotUniqueDelivery() {
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery1 = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        Delivery__c delivery2 = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeFrom.Id);
        Delivery__c delivery3 = new Delivery__c(Sender__c = postOfficeTo.Id, Receiver__c = postOfficeTo.Id);
        Delivery__c delivery4 = new Delivery__c(Sender__c = postOfficeTo.Id, Receiver__c = postOfficeFrom.Id);
        insert new List<Delivery__c> {delivery1, delivery2, delivery3, delivery4};
        Test.startTest();
        Boolean result = CourierController.prepareAndInsertDeliveries();
        Test.stopTest();
        System.assertEquals(result, false);
    }

    @IsTest static void findingDelivery(){
        String postOfficeFromName = '1';
        String postOfficeToName = '2';
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477, Name = postOfficeFromName);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477, Name = postOfficeToName);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Test.startTest();
        Delivery__c result = CourierController.findDelivery(postOfficeFromName, postOfficeToName);
        Test.stopTest();
        System.assertEquals(result.Id, delivery.Id);
    }

    @IsTest static void findingPostOfficesByDelivery(){
        String postOfficeFromName = '1';
        String postOfficeToName = '2';
        String keyForPostOfficeFrom = 'sender';
        String keyForPostOfficeTo = 'receiver';
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477, Name = postOfficeFromName);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477, Name = postOfficeToName);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Test.startTest();
        Map<String, Post_Office__c> result = new Map<String, Post_Office__c>(CourierController.findPostOfficesByDelivery(delivery));
        Test.stopTest();
        System.assert(result.get(keyForPostOfficeFrom).Id == postOfficeFrom.Id && result.get(keyForPostOfficeTo).Id == postOfficeTo.Id);
    }

    @IsTest static void findingPackageByDelivery(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Package__c packageToFind = new Package__c(Delivery__c = delivery.Id, Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Test.startTest();
        insert packageToFind;
        List<Package__c> result = CourierController.findPackagesByDelivery(delivery);
        Test.stopTest();
        System.assertEquals(result.get(0).Id, packageToFind.Id);

    }

    @IsTest static void findingWaitingToPickUpPackagesByDelivery(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Package__c packageToFind = new Package__c(Status__c = 'Waiting to pick up', Delivery__c = delivery.Id, Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Test.startTest();
        insert packageToFind;
        List<Package__c> result = CourierController.findWaitingToPickUpPackagesByDelivery(delivery);
        Test.stopTest();
        System.assertEquals(result.get(0).Id, packageToFind.Id);
    }

    @IsTest static void findingDeliveringPackagesByDelivery(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Package__c packageToFind = new Package__c(Status__c = 'Delivering', Delivery__c = delivery.Id, Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Test.startTest();
        insert packageToFind;
        List<Package__c> result = CourierController.findDeliveringPackagesByDelivery(delivery);
        Test.stopTest();
        System.assertEquals(result.get(0).Id, packageToFind.Id);
    }

    @IsTest static void findingDeliveredButNotPaidPackagesByDelivery(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert delivery;
        Package__c packageToFind = new Package__c(Status__c = 'Received by post office', Paid__c = false, Delivery__c = delivery.Id, Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Test.startTest();
        insert packageToFind;
        List<Package__c> result = CourierController.findDeliveredButNotPaidPackagesByDelivery(delivery);
        Test.stopTest();
        System.assertEquals(result.get(0).Id, packageToFind.Id);
    }

}