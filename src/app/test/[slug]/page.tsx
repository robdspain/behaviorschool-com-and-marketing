export default async function TestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div>
      <h1>Test Page</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}