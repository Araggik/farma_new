#!/bin/bash
for (( i=11; i <= 100; i++ ))
do
#echo "number is $i"
echo "wget https://pc.dialab.ru/sites/default/files/pictures/containers/$i.png"|bash
done
