import React, { useEffect } from "react"
import Header from "../components/core/Header"
import sampleRequest from "../assets/sample-audit-request.json"
import { StaticImage } from "gatsby-plugin-image"
import SEO from "../components/core/SEO"

const ReactJson = React.lazy(() => import("react-json-view"))

const BiggerPicture = () => {
  const isSSR = typeof window === "undefined"

  useEffect(() => {}, [])
  return (
    <div className="space-y-12 md:space-y-24 pb-12 px-2">
      <SEO
        title="API"
        description="Digitalfootprint.earth API Access & Badge"
      />
      <Header />
      <div className="flex items-center justify-center max-w-4xl mx-auto pt-24">
        <div className="flex flex-col text-center">
          <h1 className="font-bold text-4xl md:text-6xl mb-6">
            API Access & Badge
          </h1>
          <p className="text-lg md:text-3xl">
            Our API is open and available to all so you can programmatically
            check your site's rating.
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto space-y-2">
        <h2 className="text-xl">Request an Audit</h2>
        <div className="flex items-center space-x-4 border-yellow-400 rounded border-2">
          <p className="px-2 py-1 bg-yellow-400 text-black md:text-xl">GET</p>
          <code className="md:text-2xl">
            https://api.our-url.com/audit/{`<your-url>`}
          </code>
        </div>
        <p>
          Our audits include performance data, environmental data, CDN provider,
          CDN Edge locations. Response time is around 10 seconds if we do not
          have an audit for the URL cached. Any cached audit is invalidated
          after 24 hours.
        </p>
        <p className="font-bold">Sample Request:</p>
        <div className="bg-gray-800 w-full rounded p-2">
          <code>https://api.our-url.com/audit/sld.codes</code>
        </div>
        <p className="font-bold">Sample Response:</p>
        {!isSSR && (
          <React.Suspense fallback={<div />}>
            <ReactJson
              style={{ backgroundColor: "rgba(31, 41, 55)", padding: "0.5rem" }}
              src={sampleRequest}
              theme="ocean"
              name={null}
              collapsed={1}
            />
          </React.Suspense>
        )}
        <h2 className="text-xl pt-12">Audit Badge</h2>
        <StaticImage
          src="../assets/BadgeHero.png"
          className="object-cover h-72 w-full rounded"
          alt=""
        />
        <p>
          If you want to display the results of your audit publically, you can
          embed our customisable badge on any site page.
        </p>
        <div id="our-badge"></div>
        <div className="bg-gray-800 w-full rounded p-2">
          <code className="whitespace-pre-wrap">
            {`<div id="our-badge"></div>
<script
  type="text/javascript"
  src="http://localhost:3000/badge"
></script>
<script type="text/javascript" defer>
  generateBadge.init(); generateBadge.draw("our-badge");
</script>`}
          </code>
        </div>
      </div>
      <script
        type="text/javascript"
        src="https://cdnhatch-api.onrender.com/badge"
        async
      ></script>
      <script type="text/javascript" defer></script>
    </div>
  )
}

export default BiggerPicture
