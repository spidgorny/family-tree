FILES=("gqFtAfulvX.jpg" "HU1EVuBTYF.JPG" "HU1filSoBH.jpg" "HU1FpWtoY7.jpg" "HU1fXOgkJ5.jpg" "HU1G5WFCBT.jpg" "HU1GQ40Oc2.jpg" "HUGNTMMiPF.jpg" "HUGO7lqnfR.jpg" "HUGq3Lshbe.JPG" "HUGrlWIpOg.JPG" "HUGRU9mMcR.JPG" "HUGsNOHSRk.JPG" "HUGTdioMi3.JPG" "HV0VwHIR8V.jpg" "HV1HyiBuJD.JPG" "HV1MWkoaQx.JPG" "HV1ofN6rtf.JPG" "HV1PLfYzvE.JPG" "HV1RvVfQ4g.jpg" "HV2dHEV2S1.jpg" "HV20Trd65U.jpg" "HV21l25DlV.jpg" "HV26SlbiKn.jpg" "HV27D326ya.JPG")

echo files=$FILES
for file in "${FILES[@]}"
do
  folder="${file%.*}"
  echo one file: "$folder" "$file"
  aws s3 cp "export.xml.files/gqFtAfulvX.jpg" "s3://slawa-photo/family-tree/$folder/$file"
done