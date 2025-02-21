import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useSessionManager } from "~/contexts/SessionContext";
import { Button } from "~/components/ui/button";

export function ChatHistory() {
  const { sessions, currentSession, createNewSession } = useSessionManager();

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        {sessions.map((session) => (
          <View
            key={session.id}
            className={`p-4 mb-2 rounded-lg ${
              currentSession?.id === session.id ? "bg-primary" : "bg-secondary"
            }`}
          >
            <Text className="text-foreground">{session.name}</Text>
            <Text className="text-sm text-muted-foreground">
              {new Date(session.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View className="p-4 border-t border-border">
        <Button
          onPress={() => createNewSession("New Chat " + (sessions.length + 1))}
          className="w-full"
        >
          <Text className="text-primary-foreground">New Chat</Text>
        </Button>
      </View>
    </View>
  );
}
