import { useEffect, useState } from "react";
import { ResourceCard } from "@/components/cards/resource-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client } from "@/lib/sanity";
import { Skeleton } from "@/components/ui/skeleton";

interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  category: {
    title: string;
  };
  votes: number;
}

export function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const query = `*[_type == "resource"] {
          _id,
          title,
          description,
          url,
          category->{title},
          votes
        }`;
        const data = await client.fetch(query);
        setResources(data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const categories = ["all", ...new Set(resources.map(r => r.category.title.toLowerCase()))];
  const filteredResources = activeCategory === "all" 
    ? resources 
    : resources.filter(r => r.category.title.toLowerCase() === activeCategory);

  if (loading) {
    return (
      <main className="container px-4 py-16 sm:px-8">
        <div className="mx-auto max-w-[800px] text-center">
          <Skeleton className="h-8 w-[200px] mx-auto" />
          <Skeleton className="h-4 w-[300px] mx-auto mt-4" />
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-[800px] text-center">
        <h1 className="text-3xl font-medium sm:text-4xl">Design Resources</h1>
        <p className="mt-4 text-muted-foreground">
          Curated resources to help you learn, create, and grow as a designer in the AI era.
        </p>
      </div>

      <Tabs 
        defaultValue="all" 
        className="mt-16"
        onValueChange={setActiveCategory}
      >
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="capitalize"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={activeCategory} className="mt-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource._id}
                id={resource._id}
                title={resource.title}
                description={resource.description}
                category={resource.category.title}
                url={resource.url}
                initialVotes={resource.votes}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}