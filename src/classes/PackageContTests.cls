@IsTest
private class PackageContTests {
    @IsTest static void getPostOfficesTest() {
        String expectedNameOfPostOffice = '0';
        insert new Post_Office__c(Name = expectedNameOfPostOffice);
        Integer expectedNumberOfPostOffices = 1;

        Test.startTest();
        List<Post_Office__c> result = PackageCont.getPostOffices();
        Test.stopTest();

        System.assertEquals(expectedNumberOfPostOffices, result.size());
        System.assertEquals(expectedNameOfPostOffice, result[0].Name);
    }

    @IsTest static void TestPickListValues() {
        Map<String, List<PackageCont.PickListOption>> result = new Map<String, List<PackageCont.PickListOption>>();
        Test.startTest();
        result = (Map<String, List<PackageCont.PickListOption>>) JSON.deserialize(PackageCont.getPickListValue(), Map<String, List<PackageCont.PickListOption>>.class);
        Test.stopTest();
        System.assert(!result.get('Size__c').isEmpty());
        System.assert(!result.get('Weight__c').isEmpty());
        System.assert(!result.get('Type__c').isEmpty());
    }
}