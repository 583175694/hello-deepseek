import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export function KnowledgeBase() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="p-4 mb-4 rounded-lg bg-secondary">
          <Text className="text-lg font-semibold text-foreground">
            Knowledge Base
          </Text>
          <Text className="text-sm text-muted-foreground mt-2">
            This is where you can manage your knowledge base entries.
          </Text>
        </View>
      </ScrollView>
      <View className="p-4 border-t border-border">
        <Button className="w-full">
          <Text className="text-primary-foreground">Add Knowledge</Text>
        </Button>
      </View>
    </View>
  );
}
