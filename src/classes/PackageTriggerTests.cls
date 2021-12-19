@isTest
private class PackageTriggerTests {
    @isTest static void TestCreatePackageWithInvalidDistance() {
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 2.097782);
        insert postOfficeTo;
        insert postOfficeFrom;
        String jsonPackage = JSON.serialize(new List<Package__c>{
                new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id)
        });
        Exception longRoadException;
        Test.startTest();
        try {
            PackageCont.savePackages(jsonPackage);
        } catch (Exception e) {
            longRoadException = e;
        }
        Test.stopTest();
        System.assert(longRoadException.getMessage().contains('can\'t deliver long road'));
    }

    @isTest static void TestCreatePackageWithValidDistance() {
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.513831, Location__longitude__s = 30.570719);
        insert postOfficeTo;
        insert postOfficeFrom;
        String jsonPackage = JSON.serialize(new List<Package__c>{
                new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id)
        });
        String longRoadException;
        Test.startTest();
        try {
            PackageCont.savePackages(jsonPackage);
        } catch (Exception e) {
            longRoadException = e.getMessage();
        }
        Test.stopTest();
        System.assert(longRoadException == null);
    }
}