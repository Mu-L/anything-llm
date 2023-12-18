import paths from "@/utils/paths";
import ConnectorImages from "./media";

const DataConnectorOption = React.memo(({ slug }) => {
  if (!DATA_CONNECTORS.hasOwnProperty(slug)) return null;
  const { path, image, name, description, link } = DATA_CONNECTORS[slug];

  return (
    // ...
  );
});

export default DataConnectorOption;
        </div>
        <div className="mt-2 text-xs font-base text-white tracking-wide">
          {description}
        </div>
        <a
          href={link}
          target="_blank"
          className="mt-2 text-xs text-white font-medium underline"
        >
          {link}
        </a>
      </label>
    </a>
  );
}

export const DATA_CONNECTORS = {
  github: {
    name: "GitHub Repo",
    path: paths.settings.dataConnectors.github(),
    image: ConnectorImages.github,
    description:
      "Import an entire public or private Github repository in a single click.",
    link: "https://github.com",
  },
};
