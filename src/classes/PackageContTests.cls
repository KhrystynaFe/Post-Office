@isTest
private class PackageContTests {
    @isTest static void getPostOfficesTest() {
        insert new Post_Office__c(Name = '0');

        Test.startTest();
        List<Post_Office__c> result = PackageCont.getPostOffices();
        Test.stopTest();

        System.assertEquals(1, result.size());
        System.assertEquals('0', result[0].Name);
    }

    @isTest static void TestPickListValues() {
        Map<String, List<PackageCont.PickListOption>> result = new Map<String, List<PackageCont.PickListOption>>();
        Test.startTest();
        result = (Map<String, List<PackageCont.PickListOption>>) JSON.deserialize(PackageCont.getPickListValue(), Map<String, List<PackageCont.PickListOption>>.class);
        Test.stopTest();
        System.assert(!result.get('Size__c').isEmpty());
        System.assert(!result.get('Weight__c').isEmpty());
        System.assert(!result.get('Type__c').isEmpty());
    }
}