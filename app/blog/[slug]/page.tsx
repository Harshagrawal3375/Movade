import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { getStore } from "@/lib/db";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const store = await getStore();
  const post = store.blogs.find((b) => b.slug === params.slug);
  return {
    title: post ? `${post.title} — Movade` : "Article — Movade",
    description: post?.excerpt,
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const store = await getStore();
  const post = store.blogs.find((b) => b.slug === params.slug);
  if (!post) notFound();

  const related = store.blogs.filter((b) => b.slug !== post.slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="bg-bg-primary pt-28 md:pt-36">
        <article className="mx-auto max-w-3xl px-4 pb-20 md:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
          >
            ← All articles
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-accent-green px-3 py-1 text-[11px] font-semibold text-text-primary">
              {post.category}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              {post.date}
            </span>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.1] text-text-primary md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-text-muted md:text-lg">
            {post.excerpt}
          </p>

          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>

          <div className="mt-10 flex flex-col gap-6">
            {post.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-text-primary md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-border-subtle bg-white p-6 md:p-8">
            <h3 className="font-display text-xl font-bold text-text-primary">
              Ready to see it yourself?
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Turn this story into your itinerary — talk to a travel expert and
              we&apos;ll plan every detail around you.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-green px-6 py-3 text-sm font-semibold text-text-primary transition-transform hover:scale-[1.02]"
            >
              Plan my trip
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 7H13M13 7L8 2M13 7L8 12"
                  stroke="#0B0F0D"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </article>

        {related.length > 0 && (
          <section className="border-t border-border-subtle bg-bg-primary">
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-10">
              <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                Keep reading
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {related.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-2xl border border-border-subtle bg-white transition-shadow hover:shadow-floating"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[11px] font-medium uppercase tracking-wide text-accent-green">
                        {post.category}
                      </span>
                      <h3 className="mt-1.5 font-display text-base font-bold text-text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-xs text-text-muted">{post.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}