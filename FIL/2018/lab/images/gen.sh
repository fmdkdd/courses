#!/bin/bash

END=$1

for i in `seq 1 $END`; do
    convert -background '#ccc' -fill '#555' -pointsize 40 label:$i $i.png
done
