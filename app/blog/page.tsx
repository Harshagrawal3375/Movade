import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getStore } from "@/lib/db";

export const metadata = {
  title: "Travel Journal — Movade",
  description: "Stories, guides and hidden gems from the Movade travel team.",
};

export default async function BlogPage() {
  const store = await getStore();
  const featured = store.blogs[0];
  const rest = store.blogs.slice(1);

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <div className="mx-auto max-w-6xl px-4 md:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-green/80">
            The Travel Journal
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-5xl">
            Stories worth packing for
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            Field notes from destinations our travelers love — guides, hidden
            gems, and the kind of details you only learn by going.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-10 px-4 pb-24 md:px-10 lg:grid-cols-2 lg:gap-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative aspect-[16/10] overflow-hidden rounded-3xl lg:aspect-auto lg:row-span-2 lg:min-h-[520px]"
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
              <span className="rounded-full bg-accent-green px-3 py-1 text-[11px] font-semibold text-text-primary">
                {featured.category}
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-2 line-clamp-2 max-w-md text-sm text-white/80">
                {featured.excerpt}
              </p>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/60">
                {featured.date} · Read article →
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-6">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[110px_1fr] items-center gap-4 rounded-2xl border border-border-subtle bg-white p-3 transition-shadow hover:shadow-floating md:grid-cols-[180px_1fr] md:gap-6 md:p-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="180px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-accent-green">
                    {post.category}
                  </span>
                  <h3 className="mt-1 font-display text-base font-bold leading-snug text-text-primary md:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 hidden text-sm leading-relaxed text-text-muted md:line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-text-muted">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}