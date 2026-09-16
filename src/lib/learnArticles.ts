export type LearnSection = {
  heading: string;
  paragraphs: string[];
};

export type LearnArticle = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: LearnSection[];
  relatedSlugs: string[];
};

export const learnArticles: LearnArticle[] = [
  {
    slug: "check-hail-history-for-property",
    title: "How to Check Hail History for a Property Address",
    description:
      "Learn how to research documented hail activity near a property using storm reports, weather stations, and authoritative weather data.",
    eyebrow: "Hail History",
    intro:
      "Historical hail research can help establish whether hail was documented near a property on a particular date or during a surrounding time period. The strongest research usually considers multiple weather-data sources rather than relying on a single report.",
    sections: [
      {
        heading: "Start With the Property and Date",
        paragraphs: [
          "A useful hail-history search starts with two pieces of information: the property location and the date being investigated. For insurance-related research, this date is often referred to as the date of loss.",
          "Weather does not occur uniformly across an entire city or ZIP code. A storm may produce hail in one neighborhood while a property several miles away experiences different conditions. For that reason, property-focused research should consider the distance between the address and each documented weather observation or storm report.",
        ],
      },
      {
        heading: "Check Documented Storm Reports",
        paragraphs: [
          "Storm-event records can identify reported hail near the property. These records may include the event date and time, reported location, hail size, event type, and descriptive information about the storm.",
          "The location of a report matters. A hail report several miles from the property provides evidence that hail was documented in the surrounding area, but it does not by itself establish the exact conditions at the property.",
        ],
      },
      {
        heading: "Review the Surrounding Dates",
        paragraphs: [
          "Checking only one calendar date can miss useful context. The reported date of loss may be uncertain, weather may have occurred shortly before or after the reported date, or multiple storms may have affected the area during a short period.",
          "WeatherSnap reviews a 31-day window centered on the selected date: 15 days before the date of loss, the selected date itself, and 15 days after it. This helps identify nearby documented events that may be relevant to the investigation.",
        ],
      },
      {
        heading: "Use More Than One Weather Source",
        paragraphs: [
          "No single weather dataset provides a perfect observation for every property. Storm reports document reported severe-weather events, while weather stations provide measured observations at fixed locations. Warnings and other official weather records can provide additional context.",
          "Reviewing several authoritative sources together creates a more complete picture than relying on one isolated record.",
        ],
      },
      {
        heading: "What Hail History Can and Cannot Tell You",
        paragraphs: [
          "Historical weather data can document that hail was reported near a property, when it was reported, how large it was reported to be, and how far the report was from the property.",
          "Weather records alone do not establish that a particular building was damaged, when physical damage occurred, or whether an insurance policy provides coverage. Those questions require property-specific investigation and, when applicable, interpretation of the policy.",
        ],
      },
    ],
    relatedSlugs: [
      "find-noaa-storm-reports-near-address",
      "how-far-away-can-hail-report-be",
      "what-no-hail-reported-means",
    ],
  },

  {
    slug: "historical-weather-specific-date",
    title: "How to Find Historical Weather for a Specific Date and Location",
    description:
      "Learn how to research historical weather for a specific property, date, and surrounding area using authoritative weather records.",
    eyebrow: "Historical Weather",
    intro:
      "Finding historical weather for a specific location involves more than looking up a city's general weather history. Property-focused research should consider the date, location, nearby observations, documented storm activity, and the limitations of each data source.",
    sections: [
      {
        heading: "Define the Exact Location",
        paragraphs: [
          "Historical weather research is more useful when it begins with a specific property rather than only a city or ZIP code. Weather conditions can vary substantially across relatively short distances, particularly during thunderstorms and other localized severe-weather events.",
          "Using the property's coordinates also makes it possible to calculate the distance between the property and nearby weather stations or documented storm reports.",
        ],
      },
      {
        heading: "Identify the Date and a Reasonable Review Window",
        paragraphs: [
          "The selected date should be treated as the center of the investigation rather than necessarily the only date worth reviewing. Nearby dates can reveal other documented storms and help provide context for the conditions surrounding the date being researched.",
          "WeatherSnap uses a 31-day review window consisting of the selected date plus the 15 calendar days before and after it.",
        ],
      },
      {
        heading: "Review Weather-Station Observations",
        paragraphs: [
          "Weather stations record measured conditions at fixed locations. Depending on the station and dataset, historical observations may include temperature, precipitation, wind, gusts, and other measurements.",
          "Station distance should always be considered. An observation made at an airport or other station describes conditions at that station and should not automatically be treated as an exact measurement at a property several miles away.",
        ],
      },
      {
        heading: "Review Severe-Weather Records",
        paragraphs: [
          "Severe-weather databases provide another layer of information. Documented hail, damaging wind, tornadoes, and related events can help identify significant storm activity in the surrounding area.",
          "These records complement station observations because severe thunderstorms can produce highly localized conditions that may not be captured by the nearest fixed weather station.",
        ],
      },
      {
        heading: "Interpret Historical Weather as Evidence, Not Certainty",
        paragraphs: [
          "Historical weather records provide documented observations and reports. They are useful for establishing weather context, identifying nearby storm activity, and determining whether additional investigation may be warranted.",
          "They should not be interpreted as a complete measurement of every weather condition experienced at an individual property.",
        ],
      },
    ],
    relatedSlugs: [
      "check-hail-history-for-property",
      "check-wind-speed-specific-date",
      "weather-date-of-loss",
    ],
  },

  {
    slug: "check-wind-speed-specific-date",
    title: "How to Check Wind Speed at a Property on a Specific Date",
    description:
      "Learn how historical wind observations and storm reports can be used to research wind activity near a property on a specific date.",
    eyebrow: "Wind History",
    intro:
      "Historical wind research may involve both measured observations from weather stations and reported wind associated with severe-weather events. Understanding the difference between these records is important when investigating conditions near a property.",
    sections: [
      {
        heading: "There Are Different Types of Wind Records",
        paragraphs: [
          "A historical wind search can return several kinds of information. A weather station may provide measured sustained wind or peak gust information, while a severe-weather report may document an estimated or measured wind associated with a storm event.",
          "These values describe different observations and should not be combined or presented as though they were the same measurement.",
        ],
      },
      {
        heading: "Find Nearby Weather Stations",
        paragraphs: [
          "Fixed weather stations are one of the primary sources for historical wind observations. A station may be located at an airport, government facility, or other observing location.",
          "The closest station is not automatically the most useful station in every situation. Data availability and completeness also matter, and the distance between the station and property should be disclosed when interpreting its observations.",
        ],
      },
      {
        heading: "Check for Documented Severe-Wind Events",
        paragraphs: [
          "Storm-event records can provide additional information about damaging or severe wind in the surrounding area. Reports may include the event location, time, magnitude, and narrative details.",
          "A nearby storm-wind report can provide important evidence of severe weather in the area even when the closest weather station recorded a different wind value.",
        ],
      },
      {
        heading: "Why Station Wind and Storm Wind Can Differ",
        paragraphs: [
          "Thunderstorm winds can be highly localized. A severe gust may occur several miles from a weather station without the station recording the same magnitude.",
          "This is why a property investigation should distinguish a measured station wind from a separate severe-weather report rather than selecting whichever number is larger.",
        ],
      },
      {
        heading: "Wind Records Do Not Establish Property Damage",
        paragraphs: [
          "Historical wind records can establish that particular wind observations or reports were documented in the area. They do not independently establish the wind speed experienced at every point between observations.",
          "They also do not determine whether a roof, siding system, tree, or other property component was damaged. Physical inspection and other evidence remain necessary for that determination.",
        ],
      },
    ],
    relatedSlugs: [
      "historical-weather-specific-date",
      "storm-events-vs-weather-station-data",
      "weather-date-of-loss",
    ],
  },

  {
    slug: "find-noaa-storm-reports-near-address",
    title: "How to Find NOAA Storm Reports Near an Address",
    description:
      "Learn how NOAA storm-event records can be used to research documented hail, wind, tornado, and other severe weather near a property.",
    eyebrow: "NOAA Data",
    intro:
      "NOAA maintains extensive records of documented storm events throughout the United States. These records can provide valuable context when researching severe weather near a particular address.",
    sections: [
      {
        heading: "What NOAA Storm Records Contain",
        paragraphs: [
          "Storm-event records can include event type, beginning and ending times, location information, magnitude, injuries or fatalities when applicable, property or crop damage information, and narrative descriptions.",
          "The available information varies by event. Not every record contains every field, and the precision of event locations can also vary.",
        ],
      },
      {
        heading: "Convert the Address Into a Geographic Location",
        paragraphs: [
          "To evaluate storm reports near a property, the street address first needs to be associated with geographic coordinates. Event locations can then be compared with the property location.",
          "This allows the distance between a documented report and the property to be calculated rather than relying only on city or county names.",
        ],
      },
      {
        heading: "Filter the Records by Date and Distance",
        paragraphs: [
          "A practical property search filters the much larger storm database to events occurring within the relevant date range and geographic area.",
          "WeatherSnap emphasizes documented events within five miles of the property. When no event is found within that primary area, the closest documented event within approximately 25 miles may be shown as additional context.",
        ],
      },
      {
        heading: "Read the Event Details Carefully",
        paragraphs: [
          "The event type and magnitude are important, but they are not the entire record. Time, distance, location description, source information, and available narrative details can all help explain what was documented.",
          "A report located near a property is evidence of a documented event at or near the report location. The report should not automatically be expanded to represent exact conditions across the entire surrounding area.",
        ],
      },
      {
        heading: "Combine Storm Reports With Other Weather Records",
        paragraphs: [
          "NOAA storm records are especially useful when reviewed alongside weather-station observations and other official weather information.",
          "Using multiple datasets helps distinguish regional weather conditions, fixed-station measurements, and localized severe-weather reports.",
        ],
      },
    ],
    relatedSlugs: [
      "check-hail-history-for-property",
      "storm-events-vs-weather-station-data",
      "how-far-away-can-hail-report-be",
    ],
  },

  {
    slug: "weather-date-of-loss",
    title: "How Insurance Professionals Verify Weather on a Date of Loss",
    description:
      "Learn how historical weather records can be reviewed around an insurance claim's reported date of loss.",
    eyebrow: "Date of Loss",
    intro:
      "Weather conditions surrounding a reported date of loss are often relevant during property investigations. A useful review looks at the reported date while also considering documented activity during a reasonable surrounding period.",
    sections: [
      {
        heading: "Start With the Reported Date of Loss",
        paragraphs: [
          "The reported date of loss provides a logical starting point for weather research. Investigators can review available observations and severe-weather records associated with the property and that date.",
          "The purpose of the weather research is to document available historical information, not to independently determine whether the reported date is correct.",
        ],
      },
      {
        heading: "Look at the Surrounding Period",
        paragraphs: [
          "There are several reasons to review more than a single day. A property owner may not immediately discover damage, multiple storms may have affected the area, or a nearby documented event may have occurred shortly before or after the reported date.",
          "WeatherSnap therefore reviews 15 days before and 15 days after the selected date in addition to the date itself.",
        ],
      },
      {
        heading: "Compare Different Types of Weather Evidence",
        paragraphs: [
          "A date-of-loss review may include fixed weather-station observations, documented severe-weather events, hail reports, wind reports, tornado reports, and official warning information where available.",
          "Each source answers a somewhat different question. Together they can provide a clearer factual picture of the weather activity documented around the property.",
        ],
      },
      {
        heading: "Consider Distance From the Property",
        paragraphs: [
          "The relevance of a weather observation depends partly on where it occurred. A report at the property or very nearby generally provides different geographic context than a report many miles away.",
          "Distance should therefore be displayed alongside weather records whenever geographic coordinates are available.",
        ],
      },
      {
        heading: "Weather Verification Is Not a Coverage Decision",
        paragraphs: [
          "Historical weather research can help confirm that particular weather activity was documented in an area and can help identify dates that deserve closer investigation.",
          "It does not determine insurance coverage, establish causation, or prove that observed property damage resulted from a specific event. Those conclusions depend on additional evidence and the applicable policy.",
        ],
      },
    ],
    relatedSlugs: [
      "historical-weather-specific-date",
      "check-hail-history-for-property",
      "property-insurance-weather-reports",
    ],
  },

  {
    slug: "storm-events-vs-weather-station-data",
    title: "NOAA Storm Events vs. Weather Station Data: What's the Difference?",
    description:
      "Understand the difference between documented storm-event reports and measured weather-station observations when researching historical weather.",
    eyebrow: "Understanding Weather Data",
    intro:
      "Storm-event reports and weather-station observations describe different aspects of historical weather. Neither should automatically be treated as a substitute for the other.",
    sections: [
      {
        heading: "Weather Stations Measure Conditions at Fixed Locations",
        paragraphs: [
          "Weather stations are physical observing sites. Depending on the station and dataset, they may measure temperature, precipitation, wind speed, gusts, and other atmospheric conditions.",
          "Their greatest strength is that they provide measured observations at a known location. Their limitation for property research is equally important: the station may be several miles from the property being investigated.",
        ],
      },
      {
        heading: "Storm Events Document Severe Weather Reports",
        paragraphs: [
          "Storm-event datasets record reported severe-weather events such as hail, damaging wind, and tornadoes. A report may originate from trained spotters, emergency management, law enforcement, official observing systems, or other recognized sources.",
          "These records can capture localized severe weather that did not occur directly over a fixed weather station.",
        ],
      },
      {
        heading: "Why the Two Sources May Show Different Results",
        paragraphs: [
          "A thunderstorm can produce a strong localized gust or large hail several miles away from the nearest station. The station's measurements may therefore look relatively modest even though severe weather was documented elsewhere nearby.",
          "That difference is not necessarily a contradiction. The records may simply describe conditions at different locations.",
        ],
      },
      {
        heading: "Which Source Should You Use?",
        paragraphs: [
          "For property-focused research, the most useful approach is generally to review both when available. Station data provides measured environmental observations, while storm-event records provide information about documented severe-weather activity.",
          "The source, location, distance, time, and type of observation should remain clear so that readers can understand what each record actually establishes.",
        ],
      },
      {
        heading: "Avoid Turning Nearby Data Into Property-Level Certainty",
        paragraphs: [
          "Neither a nearby weather station nor a nearby storm report should automatically be described as an exact observation at the property.",
          "Historical weather research is strongest when it preserves that distinction and presents the underlying records with appropriate geographic context.",
        ],
      },
    ],
    relatedSlugs: [
      "find-noaa-storm-reports-near-address",
      "check-wind-speed-specific-date",
      "what-no-hail-reported-means",
    ],
  },

  {
    slug: "what-no-hail-reported-means",
    title: "What Does “No Hail Reported” Actually Mean?",
    description:
      "Learn why the absence of a documented hail report does not necessarily establish that hail did not occur at a property.",
    eyebrow: "Understanding Hail Data",
    intro:
      "A search that returns no documented hail reports should be interpreted carefully. Severe-weather databases record available observations and reports; they do not provide a complete observation of conditions at every individual property.",
    sections: [
      {
        heading: "A Database Contains Reports, Not Continuous Property Observations",
        paragraphs: [
          "Severe-weather databases are assembled from documented reports and observations. There is not an observer positioned at every property, and not every instance of hail is necessarily reported.",
          "For that reason, a search returning no nearby hail report means that the search did not identify a qualifying documented report within the selected criteria. It is not the same as a direct observation proving that no hail fell.",
        ],
      },
      {
        heading: "Hail Can Be Highly Localized",
        paragraphs: [
          "Hail-producing portions of thunderstorms can affect relatively narrow areas. Two properties within the same city can experience different hail conditions during the same storm.",
          "This spatial variability is one reason geographic distance is important when evaluating both positive and negative search results.",
        ],
      },
      {
        heading: "Search Radius Matters",
        paragraphs: [
          "A statement that no hail was reported within five miles is different from saying that no hail was reported anywhere in the region. The geographic boundary of the search should therefore be clearly identified.",
          "WeatherSnap focuses on events within five miles and can provide the closest documented event within approximately 25 miles as context when nothing qualifying is found in the primary area.",
        ],
      },
      {
        heading: "The Date Range Matters Too",
        paragraphs: [
          "Searching only the reported date of loss can overlook storms that occurred shortly before or after that date. A broader review period can help identify nearby events that may warrant additional investigation.",
          "WeatherSnap uses a 31-day window centered on the selected date so that surrounding weather activity remains visible.",
        ],
      },
      {
        heading: "Use Careful Language",
        paragraphs: [
          "A defensible historical-weather summary should describe what the records show without overstating what they prove. Phrases such as 'no documented hail reports were identified within the search area' are more precise than declaring that hail did not occur.",
          "That distinction preserves the difference between the absence of a database record and direct knowledge of conditions at the property.",
        ],
      },
    ],
    relatedSlugs: [
      "check-hail-history-for-property",
      "how-far-away-can-hail-report-be",
      "storm-events-vs-weather-station-data",
    ],
  },

  {
    slug: "how-far-away-can-hail-report-be",
    title: "How Far Away Can a Hail Report Be From a Property?",
    description:
      "Learn why distance matters when evaluating documented hail reports near a property and how nearby reports can provide weather context.",
    eyebrow: "Hail Reports",
    intro:
      "The distance between a property and a documented hail report is an important piece of context. A report describes conditions at or near the reported location and should not automatically be assumed to describe conditions at another property.",
    sections: [
      {
        heading: "There Is No Universal Distance That Proves Property Conditions",
        paragraphs: [
          "There is no single mileage threshold at which a hail report automatically proves that the same hail occurred at another location. Thunderstorms vary spatially, and hail size and coverage can change across the storm path.",
          "Distance is therefore best treated as context rather than as a pass-or-fail rule.",
        ],
      },
      {
        heading: "Closer Reports Usually Provide Stronger Geographic Context",
        paragraphs: [
          "A report located very near the property generally provides more direct geographic context than one located many miles away. However, even a very close report still describes a documented observation or report rather than a physical inspection of the property.",
          "The report's time, location, magnitude, source, and surrounding storm information should all be considered together.",
        ],
      },
      {
        heading: "Why WeatherSnap Uses a Five-Mile Primary Area",
        paragraphs: [
          "WeatherSnap emphasizes documented events within five miles of the searched property. This provides a concise way to surface nearby storm activity while keeping the geographic relationship visible.",
          "The five-mile area is a reporting framework, not a statement that a storm event inside that radius necessarily affected the property or that an event outside it could not have affected the property.",
        ],
      },
      {
        heading: "Why Show a More Distant Event at All?",
        paragraphs: [
          "When no qualifying event is found in the primary search area, a more distant event can still provide useful regional context. It may show that severe weather was documented in the broader area during the review period.",
          "WeatherSnap may therefore identify the closest documented event within approximately 25 miles while clearly presenting its distance from the property.",
        ],
      },
      {
        heading: "Distance Should Remain Visible",
        paragraphs: [
          "A nearby storm report becomes easier to interpret when the reader can see how far it was from the property. Maps and calculated distances help prevent a regional weather report from being mistaken for a property-level observation.",
          "For insurance and property investigations, preserving that geographic context is more useful than presenting a storm report without explaining where it occurred.",
        ],
      },
    ],
    relatedSlugs: [
      "check-hail-history-for-property",
      "what-no-hail-reported-means",
      "find-noaa-storm-reports-near-address",
    ],
  },

  {
    slug: "understanding-hail-sizes",
    title:
      "Understanding Hail Sizes: What 1-Inch, 1.5-Inch, and 2-Inch Hail Mean",
    description:
      "Understand common reported hail sizes and how hail measurements are described in historical severe-weather records.",
    eyebrow: "Hail Size Guide",
    intro:
      "Hail reports commonly describe hail by estimated or measured diameter. Understanding those measurements makes historical storm records easier to interpret, but hail size alone does not determine whether a particular property was damaged.",
    sections: [
      {
        heading: "How Hail Size Is Reported",
        paragraphs: [
          "Hail size is generally described by the diameter of individual hailstones. Historical severe-weather records may contain measurements or estimates reported in inches.",
          "Some reports may also use familiar object comparisons to communicate approximate size. For property research, the numeric diameter is generally easier to compare consistently across records.",
        ],
      },
      {
        heading: "What 1-Inch Hail Means",
        paragraphs: [
          "A report of 1-inch hail indicates hailstones approximately one inch in diameter at the reported location. This size is commonly associated with severe-thunderstorm reporting in the United States.",
          "The presence of a 1-inch hail report near a property documents the reported hail size at that location. It does not independently establish that the property experienced identical hail or sustained damage.",
        ],
      },
      {
        heading: "What 1.5-Inch Hail Means",
        paragraphs: [
          "A 1.5-inch report describes substantially larger hailstones than a 1-inch report. As hail diameter increases, the physical characteristics of the storm and potential impacts can also become more significant.",
          "However, property effects depend on many variables beyond diameter, including wind, hail density, duration, building materials, age, condition, slope, and the actual storm path.",
        ],
      },
      {
        heading: "What 2-Inch Hail Means",
        paragraphs: [
          "A 2-inch hail report represents large hail and is an important severe-weather observation when researching a storm. The report's exact location and distance from the property remain essential context.",
          "A large-hail report several miles away should not be converted into a claim that the same hail size occurred at the property without additional supporting evidence.",
        ],
      },
      {
        heading: "Hail Size Is Only One Part of the Investigation",
        paragraphs: [
          "Historical hail size can help identify significant storms and dates deserving closer attention, but it is only one component of a property investigation.",
          "Weather records are most useful when combined with location, timing, other storm reports, weather observations, photographs, inspection findings, and other property-specific evidence.",
        ],
      },
    ],
    relatedSlugs: [
      "check-hail-history-for-property",
      "how-far-away-can-hail-report-be",
      "property-insurance-weather-reports",
    ],
  },

  {
    slug: "property-insurance-weather-reports",
    title:
      "Historical Weather Reports for Roof and Property Insurance Claims",
    description:
      "Learn how historical weather reports can provide documented weather context for roof and property insurance investigations.",
    eyebrow: "Property Investigations",
    intro:
      "Historical weather records can provide useful factual context during roof and property investigations. They can help identify documented storm activity near a property and organize relevant observations around a reported date of loss.",
    sections: [
      {
        heading: "Why Historical Weather Is Used in Property Investigations",
        paragraphs: [
          "When a roof or exterior building component shows possible storm-related damage, investigators may want to know what weather was documented near the property and when it occurred.",
          "Historical weather research can identify relevant dates, nearby severe-weather reports, and measured observations that can be compared with inspection findings and other claim information.",
        ],
      },
      {
        heading: "Useful Information in a Property Weather Report",
        paragraphs: [
          "A property-focused weather report may include the address, selected date of loss, review period, nearby documented hail or wind events, reported magnitudes, event distances, weather-station information, maps, timelines, and source documentation.",
          "Presenting these items together can make the underlying weather records easier to review than searching several independent government datasets manually.",
        ],
      },
      {
        heading: "Why the Surrounding Dates Matter",
        paragraphs: [
          "Property damage is not always discovered immediately. In other cases, several storms may have affected an area during a relatively short period.",
          "Reviewing weather around the reported date can identify additional documented events and help an investigator decide whether another date deserves attention.",
        ],
      },
      {
        heading: "Historical Weather Should Remain Factual",
        paragraphs: [
          "A weather report is most useful when it clearly separates documented weather information from conclusions about the property. It can state that hail or wind was reported at a particular location and distance, or that a station measured a particular value.",
          "It should not convert those facts into an unsupported conclusion that a building was damaged or that a particular storm caused observed conditions.",
        ],
      },
      {
        heading: "A Weather Report Is One Part of the Evidence",
        paragraphs: [
          "Insurance and property investigations can involve photographs, inspection observations, material condition, repair history, witness information, engineering analysis, policy information, and historical weather records.",
          "Weather data can strengthen the factual timeline and help focus further investigation, but it does not replace property-specific evidence or determine coverage.",
        ],
      },
    ],
    relatedSlugs: [
      "weather-date-of-loss",
      "check-hail-history-for-property",
      "historical-weather-specific-date",
    ],
  },
];

export function getLearnArticle(
  slug: string
): LearnArticle | undefined {
  return learnArticles.find(
    (article) => article.slug === slug
  );
}