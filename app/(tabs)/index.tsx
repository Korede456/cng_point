import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Button,
} from "react-native";
import * as Linking from "expo-linking";

// Import the JSON file directly
import jsonData from "../../assets/data.json";

const ITEMS_PER_PAGE = 10;

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Simulate a fetch delay
    const loadData = async () => {
      try {
        setData(jsonData);
      } catch (error) {
        console.error("Error loading JSON data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePress = (address: string) => {
    Linking.openURL(address);
  };

  const renderCard = ({ item }: { item: (typeof jsonData)[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item.Address)}>
      <Text style={styles.title}>{item.Name}</Text>
      <Text style={styles.subtitle}>{item.Location}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  // Calculate data for the current page
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <FlatList
        data={paginatedData}
        keyExtractor={(item, index) => `${item.Name}-${index}`}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.paginationContainer}>
        <Button
          title="Previous"
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
        />
        <Text style={styles.pageInfo}>{`Page ${currentPage + 1} of ${Math.ceil(
          data.length / ITEMS_PER_PAGE
        )}`}</Text>
        <Button
          title="Next"
          onPress={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(data.length / ITEMS_PER_PAGE) - 1)
            )
          }
          disabled={endIndex >= data.length}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: "#007BFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  pageInfo: {
    fontSize: 16,
    color: "#333",
  },
});
