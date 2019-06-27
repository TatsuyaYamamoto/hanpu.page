import * as React from "react";

import {
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Typography
} from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import { useSnackbar } from "notistack";

import { LogType } from "../../domains/AuditLog";

import { ProductFile } from "../../domains/Product";

import { formatFileSize } from "../../utils/format";
import {
  downloadFromFirebaseStorage,
  getStorageObjectDownloadUrl
} from "../../utils/network";

import AudioWaveIcon from "../atoms/AudioWaveIcon";
import LoadingIcon from "../atoms/LoadingIcon";
import useAuditLogger from "../hooks/useAuditLogger";
import useDownloadCodeVerifier from "../hooks/useDownloadCodeVerifier";
import NativeAudioController from "./NativeAudioController";

const { useState, useMemo, Fragment } = React;

type SortType = "none" | "contentType" | "size";

const sortWith = (a: string | number, b: string | number) => {
  if (a < b) {
    return -1;
  }
  if (b < a) {
    return 1;
  }
  return 0;
};

interface SortSelectorProps {
  type: SortType;
  onChange: (e: React.ChangeEvent<{ name?: string; value: SortType }>) => void;
}

interface ListItemData {
  name: string;
  contentType: string;
  size: string;
  canPlay: boolean;
}

interface ProductFileListItemProps extends ListItemData {
  state: PlayerState | null;
  onStart: () => Promise<void>;
  onDownload: () => void;
}

const ProductFileListItem: React.FC<ProductFileListItemProps> = ({
  name,
  contentType,
  size,
  canPlay,
  state,
  onStart,
  onDownload
}) => {
  const onPlayIconClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    onStart();
  };

  const onDownloadIconClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    onDownload();
  };

  return (
    <ListItem button={true}>
      {/* TODO: style ListItemText width not to overlap with action icons. とりあえず、 "君のこころは輝いているかい？	" では重ならないので、対応は後回し。 */}
      <ListItemText
        primary={name}
        secondary={<Typography>{`${contentType}: ${size}`}</Typography>}
      />
      <ListItemSecondaryAction>
        {canPlay &&
          (state === "playing" ? (
            <AudioWaveIcon animation={true} />
          ) : state === "loading" ? (
            <LoadingIcon animation={true} />
          ) : (
            <IconButton onClick={onPlayIconClicked}>
              <PlayIcon />
            </IconButton>
          ))}
        <IconButton onClick={onDownloadIconClicked}>
          <DownloadIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

type PlayerState =
  // No audio file is selected
  | "none"
  // loading audio file
  | "loading"
  // can play after loading or pausing.
  | "ready"
  // now , audio is playing
  | "playing";

interface ProductFileDownloaderTableProps {
  productId: string;
  files: { [id: string]: ProductFile };
}
const ProductFileDownloaderTable: React.FC<ProductFileDownloaderTableProps> = ({
  productId,
  files
}) => {
  const { getByProductId } = useDownloadCodeVerifier();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { okAudit } = useAuditLogger();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("none");

  const onDownloadClicked = (fileId: string) => async () => {
    const { storageUrl, originalName } = files[fileId];

    // TODO: show progress status
    const snackBarKey = enqueueSnackbar(`${originalName}をダウンロード中...`, {
      persist: true
    });

    downloadFromFirebaseStorage(storageUrl, originalName).then(() => {
      closeSnackbar(snackBarKey);

      getByProductId(productId).then(({ downloadCode }) => {
        okAudit({
          type: LogType.DOWNLOAD_PRODUCT_FILE,
          params: { storageUrl, originalName, downloadCode }
        });
      });
    });
  };

  const onStartWithList = (fileId: string) => async () => {
    const { storageUrl } = files[fileId];

    const url = await getStorageObjectDownloadUrl(storageUrl);

    getByProductId(productId).then(({ downloadCode }) => {
      okAudit({
        type: LogType.PLAY_PRODUCT_FILE,
        params: { productFileId: fileId, downloadCode, url }
      });
    });

    setSelectedId(fileId);
    setAudioUrl(url);
  };

  const onPlayWithPlayer = () => {
    setPlayerState("playing");
  };

  const onPauseWithPlayer = () => {
    setPlayerState("ready");
  };

  const onClosePlayer = () => {
    setSelectedId(null);
    setAudioUrl(null);
  };

  const data = useMemo(
    () =>
      Object.keys(files)
        .map(id => {
          return {
            id,
            file: files[id]
          };
        })
        .sort((a, b) => {
          const aIndex = a.file.index;
          const bIndex = b.file.index;

          return aIndex - bIndex;
        })
        .map(({ id, file }) => {
          return {
            id,
            name: file.displayName,
            contentType: file.contentType,
            size: formatFileSize(file.size),
            // TODO!
            canPlay: ["audio/mp3", "audio/x-m4a"].includes(file.contentType)
          };
        }),
    [files]
  );

  return (
    <>
      <Paper>
        <Grid container={true} direction="column">
          <Grid item={true}>
            <List>
              {data.map(({ id, name, contentType, size, canPlay }) => (
                <Fragment key={id}>
                  <ProductFileListItem
                    state={id === selectedId ? playerState : null}
                    name={name}
                    contentType={contentType}
                    size={size}
                    canPlay={canPlay}
                    onStart={onStartWithList(id)}
                    onDownload={onDownloadClicked(id)}
                  />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      <NativeAudioController
        open={!!audioUrl}
        src={audioUrl}
        onPlay={onPlayWithPlayer}
        onPause={onPauseWithPlayer}
        onClose={onClosePlayer}
      />
    </>
  );
};

export default ProductFileDownloaderTable;
