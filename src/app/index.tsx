import { View, FlatList, SectionList, Text } from "react-native";
import { CategoryButton } from "@/components/category-button";
import { Header } from "@/components/header";
import { CATEGORIES, MENU, ProductProps } from "@/utils/data/products";
import { useRef, useState } from "react";
import { Product } from "@/components/product";
import { Link } from "expo-router";
import { useCartStore } from "@/stores/cart-store";

export default function Home() {
  const cartStore = useCartStore();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const sectionListRef = useRef<SectionList<ProductProps>>(null);

  const cartQuantityItems = cartStore.products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  function handleCategorySelect(selectedCategory: string) {
    setCategory(selectedCategory);

    const sectionIndex = CATEGORIES.findIndex(
      (category) => category === selectedCategory
    );

    if (sectionListRef.current) {
      sectionListRef.current.scrollToLocation({
        animated: true,
        itemIndex: 0,
        sectionIndex,
      });
    }
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Cardápio" cardQuantity={cartQuantityItems} />
      <FlatList
        horizontal
        className="max-h-12 mt-5 "
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 12,
          paddingHorizontal: 20,
          paddingVertical: 4,
        }}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <CategoryButton
            onPress={() => handleCategorySelect(item)}
            title={item}
            isSelected={category === item}
          />
        )}
      />
      <SectionList
        ref={sectionListRef}
        sections={MENU}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <Link href={`/product/${item.id}`} asChild>
            <Product data={item} />
          </Link>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl text-white font-heading mt-8 mb-3">
            {title}
          </Text>
        )}
        className="flex-1 p-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}
