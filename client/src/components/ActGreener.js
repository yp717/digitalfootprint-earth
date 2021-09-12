import * as React from "react"

const ActGreener = () => {
  return (
    <div className="bg-space p-5 rounded border-yellow-400 border-2">
      <h4 className="text-2xl font-bold mb-4">
        Whether you own this site or not, there's still a lot you can do to
        help reduce your digital footprint!
      </h4>
      <ul>
        <li>
          <strong>Keep your hardware longer</strong>: the devices you access the
          internet through, whether its your laptop, phone or tablet have a
          heavy environmental footprint both through their manufacturing
          processes, day-to-day use and disposal.
        </li>
        <li>
          <strong>Delete your old emails</strong>: storing large amounts of data
          can also increase your digital footprints. Deleting those emails you
          haven't looked at or used for years can go a long way toward reducing
          the impact you have on the environment
        </li>
        <li>
          <strong>Unsubscribe</strong>: Email subscriptions and mailing lists
          produce a lot of CO2. Unsubscribing from the email lists that you
          don't read instead of letting them pile up in your inbox is another
          quick step you can take to be a greener citizen of the internet
        </li>
      </ul>
    </div>
  )
}

export default ActGreener
