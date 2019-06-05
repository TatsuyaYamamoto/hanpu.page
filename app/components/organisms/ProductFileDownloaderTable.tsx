import * as React from "react";
const { useState, useMemo } = React;

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import { Product, ProductFile } from "../../domains/Product";
import { formatFileSize } from "../../utils/format";
import { downloadFromFirebaseStorage } from "../../utils/network";

interface PlayableOnlySwitchProps {
  playableOnly: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

const PlayableOnlySwitch: React.FC<PlayableOnlySwitchProps> = ({
  playableOnly,
  onChange
}) => {
  return (
    <FormControlLabel
      label="ブラウザで再生可能なファイルのみ表示"
      labelPlacement="start"
      control={<Switch checked={playableOnly} onChange={onChange} />}
    />
  );
};

type SortType = "none" | "contentType" | "size";

interface SortSelectorProps {
  type: SortType;
  onChange: (e: React.ChangeEvent<{ name?: string; value: SortType }>) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ type, onChange }) => {
  return (
    <FormControlLabel
      label={"並べ替え"}
      labelPlacement="start"
      control={
        <Select value={type} onChange={onChange}>
          <MenuItem value="none">なし</MenuItem>
          <MenuItem value="contentType">ファイル形式</MenuItem>
          <MenuItem value="size">ファイルサイズ</MenuItem>
        </Select>
      }
    />
  );
};

interface ListItemData {
  id: string;
  name: string;
  contentType: string;
  size: string;
  canPlay: boolean;
}

interface InnerListProps {
  data: ListItemData[];
  onStart: (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDownload: (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const InnerList: React.FC<InnerListProps> = ({ data, onStart, onDownload }) => {
  return (
    <>
      <List>
        {data.map(({ id, name, contentType, size, canPlay }) => (
          <React.Fragment key={id}>
            <ListItem>
              <ListItemText
                primary={name}
                secondary={
                  <>
                    <Typography>
                      {contentType}: {size}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton edge="start" onClick={onDownload(id)}>
                  <DownloadIcon />
                </IconButton>
                {canPlay && (
                  <IconButton edge="end" onClick={onStart(id)}>
                    <PlayIcon />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </>
  );
};

interface ProductFileDownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const ProductFileDownloaderTable: React.FC<ProductFileDownloaderTableProps> = ({
  files
}) => {
  const data = Object.keys(files).map(id => {
    const productFile = files[id];
    return {
      id,
      name: productFile.displayName,
      contentType: productFile.contentType,
      size: formatFileSize(productFile.size),
      // TODO!
      canPlay: productFile.contentType === "audio/mp3"
    };
  });

  const [playableOnly, setPlayableOnly] = useState(false);
  const [sortType, setSortType] = useState<SortType>("none");

  const handlePlayableOnly = () => {
    setPlayableOnly(!playableOnly);
  };

  const handleSortType = (
    e: React.ChangeEvent<{ name?: string; value: SortType }>
  ) => {
    setSortType(e.target.value);
  };

  const onDownloadClicked = (id: string) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { storageUrl, originalName } = files[id];
    downloadFromFirebaseStorage(storageUrl, originalName);
  };

  const onStartClicked = (id: string) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    //
  };

  const visibleData = useMemo(() => {
    let d = [...data];

    if (playableOnly) {
      d = d.filter(item => !!item.canPlay);
    }

    const sortWith = (a: string | number, b: string | number) => {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

    if (sortType === "contentType") {
      d.sort(({ contentType: a }, { contentType: b }) => sortWith(a, b));
    }

    if (sortType === "size") {
      d.sort(({ size: a }, { size: b }) => sortWith(a, b));
    }

    return d;
  }, [playableOnly, sortType]);

  return (
    <>
      <Paper>
        <Grid container={true} direction="column">
          <Grid item={true}>
            <PlayableOnlySwitch
              playableOnly={playableOnly}
              onChange={handlePlayableOnly}
            />
          </Grid>

          <Grid item={true}>
            <SortSelector type={sortType} onChange={handleSortType} />
          </Grid>

          <Grid item={true}>
            <InnerList
              data={visibleData}
              onStart={onStartClicked}
              onDownload={onDownloadClicked}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ProductFileDownloaderTable;
